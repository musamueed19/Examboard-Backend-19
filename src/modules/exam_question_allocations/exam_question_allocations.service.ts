import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateExamQuestionAllocationDto } from './dto/create-exam_question_allocation.dto';
import { UpdateExamQuestionAllocationDto } from './dto/update-exam_question_allocation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamQuestionAllocation } from 'src/db/entities/exam_question_allocation.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import { ExamQuestionAllocationRow } from './interfaces/exam-questions-allocation.-row.interface';
import { FacultiesService } from '../faculties/faculties.service';
import { ExamQuestionsService } from '../exam_questions/exam_questions.service';


@Injectable()
export class ExamQuestionAllocationsService {
  constructor(
    @InjectRepository(ExamQuestionAllocation)
    private examQuestionAllocationRepository: Repository<ExamQuestionAllocation>,
    private readonly facultyService: FacultiesService,
    @Inject(forwardRef(() => ExamQuestionsService))
    private readonly examQuestionService: ExamQuestionsService,
  ){}

  async create(id: string, file: Express.Multer.File, createExamQuestionAllocationDto: CreateExamQuestionAllocationDto): Promise<ExamQuestionAllocation[]> {
    if (!file) {
        throw new Error('No file uploaded');
    }

    console.log(file);

    const uploadPath = path.join('C:', 'Users', 'sinvigilator14', 'Desktop', 'Myfiles', file.originalname);
    fs.writeFileSync(uploadPath, file.buffer);


    const results: ExamQuestionAllocation[] = [];  

    const workbook = xlsx.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data: ExamQuestionAllocationRow[] = xlsx.utils.sheet_to_json<ExamQuestionAllocationRow>(worksheet);
    console.log(data);

    for (const row of data) {
        console.log(row);

        if (!row.isAllcated || !row.faculty || !row.questionId) {
            console.error('Missing required fields in row:', row);
            continue;
        }

        await this.facultyService.findByEmail(row.faculty);        
        const examQuestionAllocation = this.examQuestionAllocationRepository.create({
            question: {questionId: row.questionId},
            faculty: {email: row.faculty},
            still_allocated: row.isAllcated,
        });

        results.push(examQuestionAllocation);
    }

    if (results.length > 0) {
        await this.examQuestionAllocationRepository.save(results);
    } else {
        console.warn('No valid records to save');
    }

    console.log(results);

    return results;
}




  // create(createExamQuestionAllocationDto: CreateExamQuestionAllocationDto) {
  //   return 'This action adds a new examQuestionAllocation';
  // }




  findAll() {
    return `This action returns all examQuestionAllocations`;
  }
  async lookUp(): Promise<any[]> {
    const questions = await this.examQuestionAllocationRepository.find({
        relations: ['question', 'question.course', 'faculty'], 
    });

    if (!questions || questions.length === 0) {
        throw new NotFoundException(`No questions found`);
    }

    const result = questions.map(question => ({
        course: question.question.course, 
        faculty: question.faculty.name, 
        is_allocated: question.still_allocated, 
        allocatedDate: question.allocation_date,
    }));

    return result;
}

async allocate(examQuestionId: string, facultyId: string): Promise<ExamQuestionAllocation> {
  // Ensure the exam question exists
  const question = await this.examQuestionService.findOne(examQuestionId);
  if (!question) {
    throw new NotFoundException(`Exam question with ID ${examQuestionId} not found`);
  }

  // Ensure the faculty exists
  const faculty = await this.facultyService.findOne(facultyId);
  if (!faculty) {
    throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  }

  // Create the allocation record
  const allocation = this.examQuestionAllocationRepository.create({
    examQuestionId,
    facultyId,
    still_allocated: true,
  });

  // Save the allocation to the database
  return await this.examQuestionAllocationRepository.save(allocation);
}
  findOne(id: number) {
    return `This action returns a #${id} examQuestionAllocation`;
  }

  update(id: number, updateExamQuestionAllocationDto: UpdateExamQuestionAllocationDto) {
    return `This action updates a #${id} examQuestionAllocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} examQuestionAllocation`;
  }
}
