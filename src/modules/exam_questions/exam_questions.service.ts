import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateExamQuestionDto } from './dto/create-exam_question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam_question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamQuestion } from 'src/db/entities/exam_question.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import { ExamQuestionRow } from './interfaces/exam-questions-row.interface';
import { SemestersService } from '../semesters/semesters.service';
import { CoursesService } from '../courses/courses.service';
import { FacultiesService } from '../faculties/faculties.service';
import { ExamQuestionAllocationsService } from '../exam_question_allocations/exam_question_allocations.service';
import { ExamPaperSettingsService } from '../exam_paper_settings/exam_paper_settings.service';
@Injectable()
export class ExamQuestionsService {
  constructor(
    @InjectRepository(ExamQuestion)
    private examQuestionRepository: Repository<ExamQuestion>,
    private readonly semesterService: SemestersService,
    private readonly examPaperSettingService: ExamPaperSettingsService,
    private readonly courseService: CoursesService,
    private readonly facultyService: FacultiesService,
    @Inject(forwardRef(() => ExamQuestionAllocationsService))
    private readonly examQuestionAllocationService: ExamQuestionAllocationsService,
  ) {}

  async create(
    semesterId: string,
    file: Express.Multer.File,
    createExamQuestionDto: CreateExamQuestionDto,
  ): Promise<any> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    console.log("working", file);
    
    const uploadPath = path.join('C:', 'Users', 'invigilator14', 'Desktop', 'Myfiles', file.originalname);
    fs.writeFileSync(uploadPath, file.buffer);
    const workbook = xlsx.readFile(uploadPath);
    const sheets = workbook.SheetNames;
    const errors = [];
    const successfulSheets = [];
  
    for (const sheetName of sheets) {
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json<any>(worksheet);
  
      if (!data.length) {
        errors.push(`Sheet "${sheetName}" is empty.`);
        continue;
      }
  
      const examType = createExamQuestionDto.examType;
  
      const existingQuestions = await this.examQuestionRepository.find({
        where: {
          course: { id: data[0].Course },
          semester: { id: semesterId },
          exam: examType,
        },
      });
  
      if (existingQuestions.length > 0) {
        errors.push(`Sheet "${sheetName}" contains duplicate data for semester, course, and exam type.`);
        continue;
      }
  
      const sortedData = data.sort((a, b) => (b.UnMarked || 0) - (a.UnMarked || 0));
  
      const faculty = await this.facultyService.findAssignedFaculty(data[0].Course);
      if (!faculty.length) {
        errors.push(`No faculty assigned for course "${data[0].Course}" in sheet "${sheetName}".`);
        continue;
      }
  
      const savedRecords = [];
  
      for (const [index, row] of sortedData.entries()) {
        const examQuestionRow: ExamQuestionRow = {
          Course: row.Course,
          Qid: row.Qid,
          Marks: row.Marks,
        };
  
        if (!examQuestionRow.Course || !examQuestionRow.Qid || !examQuestionRow.Marks) {
          errors.push(`Missing required fields in row: ${JSON.stringify(row)}`);
          continue;
        }
  
        const courseExists = await this.courseService.findOne(examQuestionRow.Course);
        if (!courseExists) {
          errors.push(`Course "${examQuestionRow.Course}" not found in sheet "${sheetName}".`);
          break;
        }
  
        const validMarks = await this.examPaperSettingService.validateMarks(semesterId, examType, examQuestionRow.Marks);
        if (!validMarks) {
          errors.push(`Invalid marks for question in sheet "${sheetName}".`);
          break;
        }
  
        const question = this.examQuestionRepository.create({
          exam: examType,
          marks: examQuestionRow.Marks,
          questionId: examQuestionRow.Qid,
          course: { id: examQuestionRow.Course },
          semester: { id: semesterId },
        });
  
        await this.examQuestionRepository.save(question);
        savedRecords.push(question);
  
        const assignedFaculty = faculty[index % faculty.length];
        await this.examQuestionAllocationService.allocate(question.id, assignedFaculty.id);
      }
  
      if (savedRecords.length === sortedData.length) {
        successfulSheets.push(sheetName);
      } else {
        errors.push(`Issues in sheet "${sheetName}".`);
      }
    }
  
    return {
      successfulSheets,
      errors,
    };
  }
  


  // create(createExamQuestionDto: CreateExamQuestionDto) {
  //   return 'This action adds a new examQuestion';
  // }

  async particularMarksQuestions(courseId: string, semesterId: string, examType: string, marks: number): Promise<ExamQuestion[]> {
    const examQuestion = await this.examQuestionRepository.find({
      where: {
        course: {id: courseId},
        semester: { id: semesterId },
        exam: examType,
        marks: marks,
      },
    });
   return examQuestion;
  }

async questionIds(courseId: string, semesterId: string, examType: string, marks: number): Promise<number> {
    const count = await this.examQuestionRepository.count({
      where: {
        course: {id: courseId},
        semester: { id: semesterId },
        exam: examType,
        marks: marks,
      },
    });
  
    if (count === 0) {
      throw new NotFoundException(`No record exists for the provided course, semester, exam.`);
    }
  
    return count; 
  }
  


  async findAll(): Promise<ExamQuestion[]> {
    const questions = await this.examQuestionRepository.find();
    if(!questions) {
      throw new NotFoundException(`no question exists`)
    }
    return questions;
  }

  async findOne(id: string): Promise<ExamQuestion> {
    const question = await this.examQuestionRepository.findOneBy({id: id})
    if(!question) {
      throw new NotFoundException(`no question exists`);
    }
    return question;
  }

  async viewQuestion(id: string): Promise<any> {
    const question = await this.findOne(id);
    const examQuestion =  {
      questionId: question.questionId,
      semester: question.semester.title,
      course: question.course.id,
      exam: question.exam,
      narks: question.marks
    }
    const allocatedQuestions = await this.examQuestionAllocationService.lookUp();

    return {examQuestion, allocatedQuestions};
  }

  async editQuestionRequiredInfo(): Promise<any> {
    const faculties = await this.facultyService.findAll();
    const questions = await this.findAll();
    const facultyNames = faculties.map(faculty => faculty.name); 

    const marks = new Set(questions.map(question => question.marks));

    const marksArray = Array.from(marks);
    const allocatedQuestions = await this.examQuestionAllocationService.lookUp();
    return {
        faculties: { names: facultyNames },
        marks: marksArray,
        allocatedQuestions,
    };
  }



  async update(id: string, updateExamQuestionDto: UpdateExamQuestionDto): Promise<ExamQuestion> {
    const examQuestion = await this.findOne(id);
    if(updateExamQuestionDto.examType) examQuestion.exam = updateExamQuestionDto.examType;
    if(updateExamQuestionDto.marks) examQuestion.marks = updateExamQuestionDto.marks;
    await this.examQuestionRepository.save(examQuestion);
    return examQuestion;
  }

  async remove(id: string): Promise<any> {
    const examQuestion = await this.findOne(id);
    await this.examQuestionRepository.delete(examQuestion);
    return `question ${examQuestion.questionId} deleted successfully`;
  }
}
