import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDailyQbStatusDto } from './dto/create-daily_qb_status.dto';
import { UpdateDailyQbStatusDto } from './dto/update-daily_qb_status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyQbStatus } from 'src/db/entities/daily_qb_status.entity';
import { Repository } from 'typeorm';
import { SemestersService } from '../semesters/semesters.service';
import { CoursesService } from '../courses/courses.service';
import { ExamDayCourseWiseStrengthsService } from '../exam_day_course_wise_strengths/exam_day_course_wise_strengths.service';
import { ExamQuestionsService } from '../exam_questions/exam_questions.service';
import { ExamPaperSettingsService } from '../exam_paper_settings/exam_paper_settings.service';
import { Semester } from 'src/db/entities/semester.entity';

@Injectable()
export class DailyQbStatusService {

  constructor(
    @InjectRepository(DailyQbStatus)
    private dailyQbStatusRepository: Repository<DailyQbStatus>,
    private readonly semesterService: SemestersService,
    private readonly courseService: CoursesService,
    private readonly examDayService: ExamDayCourseWiseStrengthsService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly examPaperSettingService: ExamPaperSettingsService
) {}

  // Helper method to fetch total questions and calculate shares
  private async getTotalQuestions(courseId: string, semesterId: string, examType: string, numOfPapers: number, marks: number) {
    const questionsInPaper = await this.examPaperSettingService.countOfParticularMarksQuestions(semesterId, examType, marks);
    const totalQuestions = numOfPapers * questionsInPaper;
    const questionIds = await this.examQuestionService.questionIds(courseId, semesterId, examType, marks);
    const share =  totalQuestions / questionIds;
    return { questionIds, share };
  }

  // Helper method to process both 3-mark and 5-mark questions
  private async processQuestionTypes(courseId: string, semester: Semester, examType: string, finalTermDate: Date, numOfExamDays: number, numOfPapers: number) {
    const { questionIds: threeMarksIds, share: shareThreeMarks } = await this.getTotalQuestions(courseId, semester.id, examType, numOfPapers, 3);
    const { questionIds: fiveMarksIds, share: shareFiveMarks } = await this.getTotalQuestions(courseId, semester.id, examType, numOfPapers, 5);

    // Process 3-mark questions
    if (threeMarksIds) {
      await this.processQuestions(semester, examType, courseId, finalTermDate, numOfExamDays, 3, shareThreeMarks);
    }

    // Process 5-mark questions
    if (fiveMarksIds) {
      await this.processQuestions(semester, examType, courseId, finalTermDate, numOfExamDays, 5, shareFiveMarks);
    }
  }

  async findAll() {
    const numOfExamDays = 10;
    const semester = await this.semesterService.activeSemester();
    const finalTermDate = semester.final_term_date;
    const courses = await this.courseService.findAll();
    const examTypes = ['midterm', 'final term'];

    for (const course of courses) {
      for (const examType of examTypes) {
        const numOfPapers = await this.examDayService.enrolledStudents(course.id, semester.id, examType);
        await this.processQuestionTypes(course.id, semester, examType, finalTermDate, numOfExamDays, numOfPapers);
      }
    }
  }

  async viewDailyQbStatus() {
    const courseId = 'CS301';
    const examType = 'final term';
    const numOfExamDays = 10;
    const semester = await this.semesterService.activeSemester();
    const finalTermDate = semester.final_term_date;
    const numOfPapers = await this.examDayService.enrolledStudents(courseId, semester.id, examType);

    await this.processQuestionTypes(courseId, semester, examType, finalTermDate, numOfExamDays, numOfPapers);
  }

  private async processQuestions(semester: Semester, examType: string, courseId: string, finalTermDate: Date, numOfExamDays: number, marks: number, share: number) {
    const questions = await this.examQuestionService.particularMarksQuestions(courseId, semester.id, examType, marks);
    for (const question of questions) {
      let unmarkedQuestions = 0;
      let markedQuestions = 0;
      let tempMarkedQuestions = 0;
      let procedureDate = new Date(finalTermDate);

      while (procedureDate <= new Date(finalTermDate.getTime() + numOfExamDays * 24 * 60 * 60 * 1000)) {
        unmarkedQuestions += share / numOfExamDays;
        tempMarkedQuestions = Math.floor(unmarkedQuestions * (Math.random() * 0.5 + 0.5));
        markedQuestions += tempMarkedQuestions;
        unmarkedQuestions -= tempMarkedQuestions;
        tempMarkedQuestions = 0;
        const totalQuestions = markedQuestions + unmarkedQuestions;

        // Insert into daily_qb_status
        const dailyStatus = this.dailyQbStatusRepository.create({
          courseId: courseId,
          dateTime: procedureDate,
          Qid: question.questionId,
          marks: question.marks,
          total: totalQuestions,
          marked: markedQuestions,
          unmarked: unmarkedQuestions,
          cheating: 0,
          reviewable: 0,
          semesterId: semester.id,
          exam: examType,
        });

        await this.dailyQbStatusRepository.save(dailyStatus);
        procedureDate.setDate(procedureDate.getDate() + 1);
      }
    }
  }















// async findAll() {
//   const numOfExamDays = 10;

//   // Get active semester
//   const semester = await this.semesterService.activeSemester();
//   const finalTermDate = semester.final_term_date;

//   // Fetch all courses
//   const courses = await this.courseService.findAll(); // Assuming this method exists in courseService

//   // Define exam types (both midterm and final term)
//   const examTypes = ['midterm', 'final term'];

//   for (const course of courses) {
//       const courseId = course.id;

//       for (const examType of examTypes) {
//           // Get the number of enrolled students for this course and exam type
//           const numOfPapers = await this.examDayService.enrolledStudents(courseId, semester.id, examType);

//           // Get the number of 3-mark and 5-mark questions per paper for this exam type
//           const threeMarksQuestionsInPaper = await this.examPaperSettingService.countOfParticularMarksQuestions(semester.id, examType, 3);
//           const fiveMarksQuestionsInPaper = await this.examPaperSettingService.countOfParticularMarksQuestions(semester.id, examType, 5);

//           // Calculate total number of questions needed
//           const totalThreeMarksQuestions = numOfPapers * threeMarksQuestionsInPaper;
//           const totalFiveMarksQuestions = numOfPapers * fiveMarksQuestionsInPaper;

//           // Fetch all 3-mark and 5-mark question IDs for this course and exam type
//           const ThreeMarksQuestionsIds = await this.examQuestionService.questionIds(courseId, semester.id, examType, 3);
//           const FiveMarksQuestionsIds = await this.examQuestionService.questionIds(courseId, semester.id, examType, 5);

//           // Calculate the share of each question type
//           const shareThreeMarksQuestions =  totalThreeMarksQuestions / ThreeMarksQuestionsIds;
//           const shareFiveMarksQuestions =  totalFiveMarksQuestions / FiveMarksQuestionsIds;

//           // Process 3-mark and 5-mark questions for the current course and exam type
//           if (ThreeMarksQuestionsIds > 0) {
//               await this.processQuestions(semester, examType, courseId, finalTermDate, numOfExamDays, 3, shareThreeMarksQuestions);
//           }
//           if (FiveMarksQuestionsIds > 0) {
//               await this.processQuestions(semester, examType, courseId, finalTermDate, numOfExamDays, 5, shareFiveMarksQuestions);
//           }
//       }
//   }
// }


// async viewDailyQbStatus() {
//     const courseId = 'CS301';
//     const examType = 'final term';
//     const numOfExamDays = 10;

//     const semester = await this.semesterService.activeSemester();

//     const finalTermDate = semester.final_term_date; 
//     const numOfPapers = await this.examDayService.enrolledStudents(courseId, semester.id, examType);
//     const threeMarksQuestionsInPaper = await this.examPaperSettingService.countOfParticularMarksQuestions(semester.id, examType, 3);
//     const fiveMarksQuestionsInPaper = await this.examPaperSettingService.countOfParticularMarksQuestions(semester.id, examType, 5);

//     const totalThreeMarksQuestions = numOfPapers * threeMarksQuestionsInPaper;
//     const totalFiveMarksQuestions = numOfPapers * fiveMarksQuestionsInPaper;

//     const ThreeMarksQuestionsIds = await this.examQuestionService.questionIds(courseId, semester.id, examType, 3);
//     const FiveMarksQuestionsIds = await this.examQuestionService.questionIds(courseId, semester.id, examType, 5);

//     const shareThreeMarksQuestions = totalThreeMarksQuestions / ThreeMarksQuestionsIds;
//     const shareFiveMarksQuestions = totalFiveMarksQuestions / FiveMarksQuestionsIds;

//     await this.processQuestions(semester, examType, courseId, finalTermDate, numOfExamDays, 3, shareThreeMarksQuestions);
//     await this.processQuestions(semester, examType, courseId, finalTermDate, numOfExamDays, 5, shareThreeMarksQuestions);

// }




// private async processQuestions(semester: Semester,examType: string, courseId: string, finalTermDate: Date, numOfExamDays: number, marks: number, share: number) {

//   const questions = await this.examQuestionService.particularMarksQuestions(courseId, semester.id, examType, marks)
//     for (const question of questions) {
//         let unmarkedQuestions = 0;
//         let markedQuestions = 0;
//         let tempMarkedQuestions = 0;
//         let procedureDate = new Date(finalTermDate);

//         while (procedureDate <= new Date(finalTermDate.getTime() + numOfExamDays * 24 * 60 * 60 * 1000)) {
//             unmarkedQuestions += (share / numOfExamDays);
//             tempMarkedQuestions = Math.floor(unmarkedQuestions * (Math.random() * 0.5 + 0.5));
//             markedQuestions += tempMarkedQuestions;
//             unmarkedQuestions -= tempMarkedQuestions;
//             tempMarkedQuestions = 0;
//             const totalQuestions = markedQuestions + unmarkedQuestions;

//             // Insert into daily_qb_status
//             const dailyStatus = this.dailyQbStatusRepository.create({
//                 course: { id: courseId },
//                 date_time: procedureDate,
//                 Qid: question.question_id,
//                 marks: question.marks,
//                 total: totalQuestions,
//                 marked: markedQuestions,
//                 unmarked: unmarkedQuestions,
//                 cheating: 0,
//                 reviewable: 0,
//                 semester: { id: semester.id },
//                 exam: 'final term',
//             });

//             await this.dailyQbStatusRepository.save(dailyStatus);

//             procedureDate.setDate(procedureDate.getDate() + 1);
//         }
        
//     }
// }


  create(createDailyQbStatusDto: CreateDailyQbStatusDto) {
    return 'This action adds a new dailyQbStatus';
  }

  // findAll() {
  //   return `This action returns all dailyQbStatus`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} dailyQbStatus`;
  }

  update(id: number, updateDailyQbStatusDto: UpdateDailyQbStatusDto) {
    return `This action updates a #${id} dailyQbStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyQbStatus`;
  }
}
