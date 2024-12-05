import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateExamDayCourseWiseStrengthDto } from './dto/create-exam_day_course_wise_strength.dto';
import { UpdateExamDayCourseWiseStrengthDto } from './dto/update-exam_day_course_wise_strength.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamDayCourseWiseStrength } from 'src/db/entities/exam_day_course_wise_strength.entity';
import { In, Repository } from 'typeorm';
import { SemestersService } from '../semesters/semesters.service';
import { CoursesService } from '../courses/courses.service';
import { CreateExamDayStrengthDto } from './dto/create-exam_day_course_wise_strength.dto';
import * as fs from 'fs';
import * as path from 'path';
import { format, parse } from 'date-fns'
import * as xlsx from 'xlsx';
import { ExamDayCourseWiseStrengthRow } from './Interfaces/exam-day-course-wise-strength-row.interface';
@Injectable()
export class ExamDayCourseWiseStrengthsService {
  constructor(
    @InjectRepository(ExamDayCourseWiseStrength)
    private readonly examDayStrengthRepository: Repository<ExamDayCourseWiseStrength>,
    private readonly semesterService: SemestersService,
    private readonly courseService: CoursesService,
  ) {}


  
  async handleFileUpload(id: string, file: Express.Multer.File, body: CreateExamDayStrengthDto): Promise<ExamDayCourseWiseStrength[]> {
    if (!file) {
      throw new Error('No file uploaded');
    }
  
    console.log(file);
  
    const uploadPath = path.join('C:', 'Users', 'invigilator14', 'Desktop', 'Myfiles', file.originalname);
    fs.writeFileSync(uploadPath, file.buffer);
  
    const results: ExamDayCourseWiseStrength[] = [];
  
    const workbook = xlsx.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
  
    const data: ExamDayCourseWiseStrengthRow[] = xlsx.utils.sheet_to_json<ExamDayCourseWiseStrengthRow>(worksheet);
    console.log(data);
  
    for (const row of data) {
      console.log(row);
  
      if (!body.examType || !row.Strength || !row.ExamDate || !row.CourseCode) {
        console.error('Missing required fields in row:', row);
        continue;
      }
  
      let parsedDate: Date;
  
      // Check if `row.date` is a number (Excel numeric date)
      if (typeof row.ExamDate === 'number') {
        // Convert Excel serial date to JavaScript Date
        parsedDate = new Date(Math.round((row.ExamDate - 25569) * 86400 * 1000));
      } else if (typeof row.ExamDate === 'string') {
        // Parse date from DD-MM-YYYY format
        const dateParts = row.ExamDate.split('-');
        if (dateParts.length !== 3) {
          console.error('Invalid date format in row:', row);
          continue;
        }
        const [day, month, year] = dateParts.map(Number);
        parsedDate = new Date(year, month - 1, day); // month is 0-indexed
      } else {
        console.error('Invalid date type in row:', row);
        continue;
      }
  
      // Check if parsedDate is valid
      if (isNaN(parsedDate.getTime())) {
        console.error('Parsed date is invalid in row:', row);
        continue;
      }
  
      // Format the date to 'yyyy-MM-dd HH:mm:ss' using date-fns
      const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
  

  
      await this.semesterService.findOne(id);
      await this.courseService.findOne(row.CourseCode);
  
      const examDayCourseWiseStrength = this.examDayStrengthRepository.create({
        exam: body.examType,
        num_of_students: parseInt(row.Strength, 10),
        date: formattedDate, // Store the formatted date
        semester: { id: id },
        course: { id: row.CourseCode },
      });
  
      results.push(examDayCourseWiseStrength);
    }
  
    console.log(results.length);
  
    if (results.length > 0) {
      await this.examDayStrengthRepository.save(results);
    } else {
      console.warn('No valid records to save');
    }
  
    console.log(results);
  
    return results;
  }
  






  // create(createExamDayCourseWiseStrengthDto: CreateExamDayCourseWiseStrengthDto) {
  //   return 'This action adds a new examDayCourseWiseStrength';
  // }

  async enrolledStudents(courseId: string, semesterId: string, examType: string): Promise<number> {
    const count = await this.examDayStrengthRepository.count({
      where: {
        course: { id: courseId },
        semester: { id: semesterId },
        exam: examType,
      },
    });
  
    if (count === 0) {
      throw new NotFoundException(`No record exists for the provided course, semester, and exam.`);
    }
  
    return count;
  }
  
async activeSemester(): Promise<any> {
  return await this.semesterService.activeSemester();
}

  async findAll(): Promise<any[]> {
    const exams = await this.examDayStrengthRepository.find({
        relations: ['semester'],
        select: {
            id: true,
            semester: {
                id: true,
                title: true,
            },
            courseId: true,
            exam: true,
            num_of_students: true,
            date: true,
        },
    });
    
    if (!exams || exams.length === 0) {
        throw new NotFoundException(`No records found`);
    }

    const formattedExams = exams.map(exam => ({
        id: exam.id,
        courseId: exam.courseId,
        exam: exam.exam.replace(/^"|"$/g, ''), // Remove extra double quotes around exam
        num_of_students: exam.num_of_students,
        date: exam.date,
        semester: exam.semester.title, 
    }));

    return formattedExams;
}

async lookUp(id: string): Promise<ExamDayCourseWiseStrength> {
  const exam = await this.examDayStrengthRepository.findOne({
    where: {id},
    relations: ['semester', 'course'],
  })
  return exam
}
async findOne(id: string): Promise<any> {
  const exam = await this.examDayStrengthRepository.findOne({
      where: { id },
      relations: ['semester', 'course'],
      select: {
          id: true,
          semester: {
              id: true,
              title: true,
          },
          courseId: true,
          exam: true,
          num_of_students: true,
          date: true,
      },
  });

  if (!exam) {
      throw new NotFoundException(`Record not found`);
  }

  // Format the response to remove extra quotes around "exam" and include only "semester.title"
  return {
      id: exam.id,
      courseId: exam.courseId,
      exam: exam.exam.replace(/^"|"$/g, ''), // Remove extra double quotes around exam
      num_of_students: exam.num_of_students,
      date: exam.date,
      semester: exam.semester.title, // Include only semester title
  };
}



 async update(id: string, updateExamDayCourseWiseStrengthDto: UpdateExamDayCourseWiseStrengthDto): Promise<ExamDayCourseWiseStrength> {
  const exam = await this.lookUp(id);
  console.log(exam);
  
  if(updateExamDayCourseWiseStrengthDto?.no_of_students > exam.course.student_enrollment) {
    throw new BadRequestException(`enter students ${updateExamDayCourseWiseStrengthDto.no_of_students} is greate then total students enrolled ${exam.course.student_enrollment} in ${exam.course.id}`)
  }

  if(updateExamDayCourseWiseStrengthDto.examType) exam.exam = updateExamDayCourseWiseStrengthDto.examType;
  if(updateExamDayCourseWiseStrengthDto.no_of_students) exam.num_of_students = updateExamDayCourseWiseStrengthDto.no_of_students;
  if(updateExamDayCourseWiseStrengthDto.date) exam.date = updateExamDayCourseWiseStrengthDto.date;
  await this.examDayStrengthRepository.save(exam);
  return exam;
  }

// async remove(id: string): Promise<any> {
//   const exam = await this.findOne(id);
//   await this.examDayStrengthRepository.delete(exam);
//   return `course  deleted successfully`
//   }
async remove(ids: string): Promise<any> {
  // const location = await this.findOne(id);
  // await this.locationRepository.delete(location);
  // return `loaction ${location.location} deleted successfully`;

  // const designation = await this.findOne(id);
  // await this.designationRepository.delete(designation);
  // return `${designation.designation} designation deleted successfully`;

  const idArray = Array.isArray(ids) ? ids : [ids];

  console.log('Input IDs:', idArray);

  const examDaysStrength = await this.examDayStrengthRepository.find({
    where: { id: In(idArray) },
  });

  // console.log('Fetched Semesters Count:', designations.length);
  // console.log('Fetched Semesters:', designations);
  // console.log('Requested IDs Count:', idArray.length);
  // console.log('Requested IDs:', idArray);

  const fetchedIds = examDaysStrength.map((examDay) => examDay.id);

  const missingIds = idArray.filter((id) => !fetchedIds.includes(id));
  if (missingIds.length > 0) {
    console.warn('The following IDs were not found:', missingIds.join(', '));
  }

  const deletePromises = examDaysStrength.map(async (examDay) => {
    return this.examDayStrengthRepository.delete(examDay.id);
  });

  await Promise.all(deletePromises);

  return `examdaycoursewise deleted successfully`;
}
}
