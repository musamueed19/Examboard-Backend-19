import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamPaperSettingDto } from './dto/create-exam_paper_setting.dto';
import { UpdateExamPaperSettingDto } from './dto/update-exam_paper_setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamPaperSetting } from 'src/db/entities/exam_paper_setting.entity';
import { ILike, In, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class ExamPaperSettingsService {
  constructor(
    @InjectRepository(ExamPaperSetting)
    private examPaperRepository: Repository<ExamPaperSetting>,
  ){}
  async create(id: string, createExamPaperSettingDto: CreateExamPaperSettingDto): Promise<ExamPaperSetting[]> {
    try {
      console.log(createExamPaperSettingDto);

      // Check for existing exam papers with the same criteria
      const existingExamPapers = await this.examPaperRepository.find({
        where: {
          semester: { id },
          exam_type: createExamPaperSettingDto.exam_type,
          courseType: createExamPaperSettingDto.course_type,
        },
      });

      // Check if any existing exam paper has the same question_marks and question_quantity
      const duplicateFound = existingExamPapers.some(existingPaper =>
        createExamPaperSettingDto.questions.some(question =>
          existingPaper.question_marks === question.marks &&
          existingPaper.question_quantity === question.noOfQuestions,
        ),
      );

      if (duplicateFound) {
        throw new BadRequestException(
          'An exam paper already exists with the same semester, exam type, course type, marks, and question quantity. Please ensure that you are not creating duplicates.',
        );
      }

      // If no duplicates found, create new exam papers
      const examPapers: ExamPaperSetting[] = [];

      for (const question of createExamPaperSettingDto.questions) {
        const examPaper = this.examPaperRepository.create({
          semester: { id },
          courseType: createExamPaperSettingDto.course_type,
          exam_type: createExamPaperSettingDto.exam_type,
          question_marks: question.marks,
          question_quantity: question.noOfQuestions,
        });

        examPapers.push(await this.examPaperRepository.save(examPaper));
      }

      return examPapers; // Return the created exam papers
    } catch (error) {
      // Handle unique constraint violation error
      if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
        throw new BadRequestException('Duplicate entry: An exam paper with the same criteria already exists.');
      }

      // Re-throw other errors to be handled by the global exception filter
      throw error;
    }
  }
  async validateMarks(semesterId: string, examType: string, marks: number): Promise<boolean> {
    const settings = await this.examPaperRepository.findOne({
      where: {
        semester: { id: semesterId },
        question_marks: marks,
        exam_type: examType,
      },
    });
    return !!settings;
  }
  



  findAll() {
    return `This action returns all examPaperSettings`;
  }

  async countOfParticularMarksQuestions(semesterId: string, examType: string, marks: number): Promise<number> {
    const count = await this.examPaperRepository.count({
      where: {
        semester: { id: semesterId },
        exam_type: examType,
        question_marks: marks,
      },
    });
  
    if (count === 0) {
      throw new NotFoundException(`No record exists for the provided semester, exam.`);
    }
  
    return count; 
  }
  

  // async findAllOfSameSemester(id: string): Promise<ExamPaperSetting[]> {
  //   const examPaper = await this.examPaperRepository.find({
  //     where: {
  //       semester: {
  //         id: id,
  //       },
  //     },
  //   });
  
  //   if (!examPaper) {
  //     throw new BadRequestException('Exam paper does not exist of the same semester');
  //   }
  //   return examPaper;
    
  // }
  async findAllOfSameSemester(id: string, search?: string, limit?: number, page?: number): Promise<{ data: ExamPaperSetting[]; total: number }> {
    const [data, total] = await this.examPaperRepository.findAndCount({
      where: {
        semesterId: id,
        exam_type: search ? ILike(`%${search}%`) : undefined,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  
    return { data, total };
  }
  
  

async findOneById(id: string): Promise<ExamPaperSetting> {
  const examPaper = await this.examPaperRepository.findOneBy({id: id});
  
  if (!examPaper) {
    throw new BadRequestException('Exam paper does not exist');
  }
return examPaper;
}


async update(id: string, updateExamPaperSettingDto: UpdateExamPaperSettingDto): Promise<ExamPaperSetting> {
  // Find the existing exam paper by ID
  const examPaper = await this.findOneById(id);

  // Check for existing exam papers with the same criteria
  // const existingExamPapers = await this.examPaperRepository.find({
  //     where: {
  //         semester: examPaper.semester, // Ensure you're checking against the same semester
  //         exam_type: updateExamPaperSettingDto.exam_type,
  //         courseType: updateExamPaperSettingDto.course_type,
  //     },
  // });

  // Check if any existing exam paper has the same marks and question quantity
  // const duplicateFound = existingExamPapers.some(existingPaper =>
  //     existingPaper.question_marks === updateExamPaperSettingDto.marks &&
  //     existingPaper.question_quantity === updateExamPaperSettingDto.noOfQuestions
  // );

  // if (duplicateFound) {
  //     throw new BadRequestException('An exam paper already exists with the same semester, exam type, marks, and question quantity.');
  // }

  // Update the fields if provided in the DTO
  // if (updateExamPaperSettingDto.marks !== undefined) {
  //     examPaper.question_marks = updateExamPaperSettingDto.marks;
  // }
  if (updateExamPaperSettingDto.noOfQuestions !== undefined) {
      examPaper.question_quantity = updateExamPaperSettingDto.noOfQuestions;
  }

  // Save the updated exam paper
  await this.examPaperRepository.save(examPaper);

  return examPaper;
}


//  async remove(id: string):Promise<any> {
//     const examPaper = await this.findOneById(id);
  
//     if (!examPaper) {
//       throw new BadRequestException('Exam paper does not exist of the same semester');
//     } 
//     await this.examPaperRepository.delete(examPaper)
//     return `exam paper deleted`
//   }


//   async removeAll(ids: string[]): Promise<any> {
//     const examPapers = await this.examPaperRepository.find({
//       where: {
//         id: In(ids), 
//       },
//     });
  
//     if (examPapers.length === 0) {
//       throw new BadRequestException('No exam papers found for the specified semester and exam types');
//     }
  
//     const idsToDelete = examPapers.map(paper => paper.id); 
//     await this.examPaperRepository.delete(idsToDelete);
  
//     return { message: `${idsToDelete.length} exam papers deleted successfully` };
//   }
 
async removeAll(ids: string | string[]): Promise<any> {
  const idArray = Array.isArray(ids) ? ids : [ids];

  console.log('Input IDs:', idArray);
  
  const examPapers = await this.examPaperRepository.find({
      where: { id: In(idArray) },
  });


  // Create a set of fetched IDs for easier checking
  const fetchedIds = examPapers.map(examPaper => examPaper.id);

  // Check for missing IDs and log them
  const missingIds = idArray.filter(id => !fetchedIds.includes(id));
  if (missingIds.length > 0) {
      console.warn('The following IDs were not found:', missingIds.join(', '));
      // You can decide whether to throw an error or continue
  }

  const deletePromises = examPapers.map(async examPaper => {
      return this.examPaperRepository.delete(examPaper.id);  // Delete by ID
  });

  await Promise.all(deletePromises);

  return `exampapers deleted successfully`;
}
}


