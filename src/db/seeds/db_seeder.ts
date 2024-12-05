import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Designation } from "../entities/designation.entity";
import { Location } from "../entities/location.entity";
import { Faculty } from "../entities/faculty.entity";
import { UserRole } from "../entities/user_role.entity";
import { faker } from "@faker-js/faker";
import { CourseAllocation } from "../entities/course_allocation.entity";
import { RolePermission } from "../entities/role_permission.entity";
import { Permission } from "../entities/permission.entity";
import { UserPermission } from "../entities/user_permission.entity";
import { Course } from "../entities/course.entity";
import { ExamDayCourseWiseStrength } from "../entities/exam_day_course_wise_strength.entity";
import { Semester } from "../entities/semester.entity";
import { ExamPaperSetting } from "../entities/exam_paper_setting.entity";
import { Section } from "../entities/section.entity";
import { SectionCoordinator } from "../entities/section_coordinator.entity";
import { DailyQbStatus } from "../entities/daily_qb_status.entity";
import { ExamQuestion } from "../entities/exam_question.entity";
import { ExamQuestionAllocation } from "../entities/exam_question_allocation.entity";
import * as bcrypt from 'bcrypt';
import dataSource from "../data-source";


const seedData = async (dataSource: DataSource) => {
  if (!dataSource.isConnected) {
    console.error("Error: Database connection not established!");
    return;
  }
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const designationRepository = dataSource.getRepository(Designation);
  const locationRepository = dataSource.getRepository(Location);
  const facultyRepository = dataSource.getRepository(Faculty);
  const userRoleRepository = dataSource.getRepository(UserRole);
  const sectionRepository = dataSource.getRepository(Section);
  const sectionCoordinatorRepository = dataSource.getRepository(SectionCoordinator);
  const semesterRepository = dataSource.getRepository(Semester);
  const courseRepository = dataSource.getRepository(Course);
  const courseAllocationRepository = dataSource.getRepository(CourseAllocation);
  // Seed Roles
  const roles = [
    { name: "HoD", category: "Academic" },
    { name: "Section-Coordinator", category: "Academic" },
    { name: "Course-Incharge", category: "Academic" },
    { name: "Course-member", category: "Academic" },
    { name: "Admin", category: "System" },
    { name: "Faculty member", category: "Academic" },
    { name: "Group Lead", category: "Management" },
  ];

  // Insert roles into the database
for (const role of roles) {
    // Check if the role already exists
    const existingRole = await roleRepository.findOne({
      where: { name: role.name },
    });

    if (!existingRole) {
      const newRole = roleRepository.create(role);
      await roleRepository.save(newRole);
      console.log(`Role "${role.name}" added to the database.`);
    } else {
      console.log(`Role "${role.name}" already exists.`);
    }
  }

  console.log("Roles seeding completed!");
  const adminRole = await roleRepository.findOneBy({ name: "Admin" });
  const facultyRole = await roleRepository.findOneBy({ name: "Faculty member" });

  const professor = designationRepository.create({
    designation: "Professor",
  });
  const assistantProfessor = designationRepository.create({
    designation: "Assistant Professor",
  });
  await designationRepository.save([professor, assistantProfessor]);

  // Seed Locations
  const mainCampus = locationRepository.create({
    location: "Main Campus",
  });
  const cityCampus = locationRepository.create({
    location: "City Campus",
  });
  await locationRepository.save([mainCampus, cityCampus]);

  // Seed Faculties


      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash("ABC*123abc", salt);
      const adminUser = userRepository.create({
          email: "admin@vu.edu.pk",
          password: hashedPassword,  
          is_active: true,
          is_validate: true,
      });
      await userRepository.save(adminUser);
    
  
      
      const generalUser = userRepository.create({
          email: "user@vu.edu.pk",
          password: hashedPassword,  
          is_active: true,
          is_validate: true,
      });
      await userRepository.save(generalUser);

      const generalUser2 = userRepository.create({
        email: "taha@vu.edu.pk",
        password: hashedPassword,  
        is_active: true,
        is_validate: true,
    });
    await userRepository.save(generalUser2);
      console.log("General user created:", generalUser);
      const faculty1 = facultyRepository.create({
        name: "Musa",
        location: mainCampus,
        contact_number: "3252445325",
        designation: professor,
        email: "user@vu.edu.pk",
        user: generalUser,
      });
    
      const faculty2 = facultyRepository.create({
        name: "Taha",
        location: cityCampus,
        contact_number: "234455635",
        designation: assistantProfessor,
        email: "taha@vu.edu.pk",
        user: generalUser2,
      });
      await facultyRepository.save([faculty1, faculty2]);
       
  

// Main seed function to handle creation and role assignment
const seedData = async () => {
    // Create the users and await their resolution

    const adminRole = await roleRepository.findOne({ where: { name: "Admin" } });
    const facultyRole = await roleRepository.findOne({ where: { name: "Faculty member" } });
    
    if (!adminRole || !facultyRole) {
        throw new Error("Required roles (admin or faculty) are missing.");
    }
    
    console.log("Admin Role:", adminRole);
    console.log("Faculty Role:", facultyRole);
    
    // Seed UserRoles for both users
    const adminUserRole = userRoleRepository.create({
        userId: adminUser.id,
        roleId: adminRole.id,
    });

    const generalUserRole = userRoleRepository.create({
        userId: generalUser.id,
        roleId: facultyRole.id,
    });

    await userRoleRepository.save([adminUserRole, generalUserRole]); 
};

seedData()
    .then(() => console.log("Data seeded successfully"))
    .catch(console.error);

  
  const semester1 = semesterRepository.create({
    title: "Fall 2024",
    start_date: "2024-08-15",  
    end_date: "2024-12-15",    
    mid_term_date: "2024-10-15",  
    final_term_date: "2024-12-10",  
    mid_term_end_date: "2024-10-20",  
    final_term_end_date: "2024-12-15",  
    is_Active: true,
    created_on: new Date(),   
    updated_on: new Date()      
});

await semesterRepository.save(semester1);


  const section1 = sectionRepository.create({
    title: "Section A",
});

await sectionRepository.save(section1);

const sectionCoordinator1 = sectionCoordinatorRepository.create({
    section: section1,          // Reference to an existing Section entity
    sectionId: section1.id,     // ID of the referenced Section
    faculty: faculty1,          // Reference to an existing Faculty entity
    facultyId: faculty1.id,     // ID of the referenced Faculty
    semester: semester1,        // Reference to an existing Semester entity
    semesterId: semester1.id,   // ID of the referenced Semester
    from_date: new Date(),      // Setting current date as the start date
    to_date: null               // Optional, can be set if there's an end date
});



// Save the created section coordinator to the database
await sectionCoordinatorRepository.save(sectionCoordinator1);

const course1 = courseRepository.create({
  id: 'CS301',
  title: 'Data Structure',
  student_enrollment: 200,
  type: 'Regular'
})
  
const course2 = courseRepository.create({
  id: 'CS201',
  title: 'Introduction To Programming',
  student_enrollment: 400,
  type: 'Regular'
})
 await courseRepository.save(course1);
 await courseRepository.save(course2);


  const courseInchargeRole = await roleRepository.findOneBy({ name: "Course-Incharge" });
  const courseMemberRole = await roleRepository.findOneBy({ name: "Course-member" });

  if (!course1 || !course2 || !faculty1 || !faculty2 || !semester1 || !section1 || !courseInchargeRole || !courseMemberRole) {
    throw new Error("Required data for CourseAllocation is missing!");
  }

  // Create course allocations
  const allocation1 = courseAllocationRepository.create({
    course: course1,
    faculty: faculty1,
    semester: semester1,
    section: section1,
    role: courseInchargeRole,
    contribution: "Regular",
    teacher_share: 50,
    students_allocated: 100,
    mid_target: 50,
    final_target: 50,
    created_on: new Date(),
    updated_on: new Date(),
  });

  const allocation2 = courseAllocationRepository.create({
    course: course2,
    faculty: faculty2,
    semester: semester1,
    section: section1,
    role: courseMemberRole,
    contribution: "Marking",
    teacher_share: 50,
    students_allocated: 300,
    mid_target: 150,
    final_target: 150,
    created_on: new Date(),
    updated_on: new Date(),
  });

  await courseAllocationRepository.save([allocation1, allocation2]);
  console.log("Seeding completed!");
};


dataSource.initialize().then(async () => {
  try {
      if (!dataSource.isInitialized) {
          throw new Error("Data source failed to initialize");
      }
      console.log("Data source initialized successfully.");
      await seedData(dataSource);
  } finally {
      console.log("Seeding finished, closing connection...");
      await dataSource.destroy(); // Close connection after seeding
  }
}).catch(error => {
  console.error("Error during DataSource initialization", error);
});


// Initialize DataSource and run the seeder
// const AppDataSource = new DataSource({
//   type: "mysql",
//   host: "localhost",
//   port: 3306,
//   username: "root",
//   password: "root", // Use your DB credentials here
//   database: "examboard",
//   synchronize: true, // Set to false if you don't want to auto-sync your entities
//   logging: false,
//   entities: [User, Role, Designation, Location, Faculty, UserRole, CourseAllocation, RolePermission, Permission, UserPermission, Course, ExamDayCourseWiseStrength, Semester, ExamPaperSetting, Section, SectionCoordinator, DailyQbStatus, ExamQuestion, ExamQuestionAllocation],
// // entities: ['dist/db/entities/**/*{.ts,.js}'],
// });

// AppDataSource.initialize()
//   .then(async () => {
//     await seedData(AppDataSource);
//     console.log("Seeding finished, closing connection...");
//     await AppDataSource.destroy();
//   })
//   .catch((error) => console.log("Error during seeding:", error));




// import { DataSource } from 'typeorm';
// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { User } from '../entities/user.entity';
// import { Role } from '../entities/role.entity';
// import { Faculty } from '../entities/faculty.entity';
// import { Location } from '../entities/location.entity';
// import { Designation } from '../entities/designation.entity';
// import { UserRole } from '../entities/user_role.entity';

// export default class DBSeeder implements Seeder {
//   public async run(
//     dataSource: DataSource,
//     factoryManager: SeederFactoryManager,
//   ): Promise<void> {
//     // repositories
//     const rep_users = dataSource.getRepository(User);
//     const rep_role = dataSource.getRepository(Role);
//     const rep_permission = dataSource.getRepository(Faculty);
//     const rep_location = dataSource.getRepository(Location);
//     const rep_user = dataSource.getRepository(Designation);
//     const rep_phase = dataSource.getRepository(UserRole);

//     /* Delete the data from the DB before feeding */
//     await rep_users.createQueryBuilder().delete().from(User).execute();

//     await rep_role.createQueryBuilder().delete().from(Role).execute();


//     await rep_cities.createQueryBuilder().delete().from(City).execute();
//     await rep_province.createQueryBuilder().delete().from(Province).execute();
//     await rep_phase.createQueryBuilder().delete().from(Phase).execute();
//     await rep_location.createQueryBuilder().delete().from(Location).execute();
//     await rep_studyProgram
//       .createQueryBuilder()
//       .delete()
//       .from(StudyProgram)
//       .execute();
//     await rep_degree.createQueryBuilder().delete().from(Degree).execute();
//     await rep_degree.createQueryBuilder().delete().from(Department).execute();
//     await rep_degree.createQueryBuilder().delete().from(Designation).execute();

//     /* Feeding data in Provinces*/
//     const provinces = [
//       { name: 'Punjab' },
//       { name: 'Sindh' },
//       { name: 'Khyber Pakhtunkhwa' },
//       { name: 'Balochistan' },
//       { name: 'Gilgit' },
//       { name: 'Kashmir' },
//       { name: 'Islamabad' },
//     ];
//     // for (let province of provinces) {
//     //   const createdProvince = rep_province.create(province);
//     //   await rep_province.save(createdProvince);
//     // }

//     const punjab = await rep_province.save(rep_province.create(provinces[0]));
//     const sindh = await rep_province.save(rep_province.create(provinces[1]));
//     const khyberPakhtunkhwa = await rep_province.save(
//       rep_province.create(provinces[2]),
//     );
//     const balochistan = await rep_province.save(
//       rep_province.create(provinces[3]),
//     );
//     const gilgitBaltistan = await rep_province.save(
//       rep_province.create(provinces[4]),
//     );
//     const azadKashmir = await rep_province.save(
//       rep_province.create(provinces[5]),
//     );
//     const islamabadTerritory = await rep_province.save(
//       rep_province.create(provinces[6]),
//     );

//     /* Punjab cities entry */
//     if (punjab) {
//       const punjabCitiesData = [
//         'Gujranwala',
//         'Gujrat',
//         'Hafizabad',
//         'Haroonabad',
//         'Hasilpur',
//         'Haveli lakha',
//         'Jalalpur pirwal',
//         'Jampur',
//         'Jand',
//         'Jaranwala',
//         'Jhang',
//         'Jhelum',
//         'Joharabad',
//         'Kabirwala',
//         'Kahuta'
//       ];
//       for (const cityName of punjabCitiesData) {
//         const punjabcity = rep_cities.create({
//           name: cityName,
//           province: punjab,
//         });
//         await rep_cities.save(punjabcity);
//       }
//     }

//     /* Sindh cities entry */
//     if (sindh) {
//       const sindhCitiesData = [
//         'Badin',
//         'Larkana',
//         'Bhit Shah',
//         'Sanghar',
//         'Hyderabad',
//         'Sukkur',
//         'Karachi',
//       ];
//       for (const cityName of sindhCitiesData) {
//         const sindhcity = rep_cities.create({
//           name: cityName,
//           province: sindh,
//         });

//         await rep_cities.save(sindhcity);
//       }
//     }

//     /* balochistan cities entry */
//     if (balochistan) {
//       const balochistanCitiesData = ['Dera Bugti', 'Sibbi', 'Quetta', 'Turbat'];

//       for (const cityName of balochistanCitiesData) {
//         const balochistancity = rep_cities.create({
//           name: cityName,
//           province: balochistan,
//         });

//         await rep_cities.save(balochistancity);
//       }
//     }

//     /* KPK entry */
//     if (khyberPakhtunkhwa) {
//       const kpkCitiesData = [
//         'Abbotabad',
//         'Mingora',
//         'Chakdara',
//         'Swabi',
//         'Mansehra',
//         'Timergarah',
//         'Mardan',
//       ];

//       for (const cityName of kpkCitiesData) {
//         const kpkcity = rep_cities.create({
//           name: cityName,
//           province: khyberPakhtunkhwa,
//         });
//         await rep_cities.save(kpkcity);
//       }
//     }

//     /* Gilgit entry */
//     if (gilgitBaltistan) {
//       const gilgitBaltistanCitiesData = ['Gilgit', 'Skardu'];

//       for (const cityName of gilgitBaltistanCitiesData) {
//         const gilgitcity = rep_cities.create({
//           name: cityName,
//           province: gilgitBaltistan,
//         });
//         await rep_cities.save(gilgitcity);
//       }
//     }

//     /* kashmir entry */
//     if (azadKashmir) {
//       const azadKashmirCitiesData = ['Kotli', 'Muzaffarabad', 'Mirpur'];

//       for (const cityName of azadKashmirCitiesData) {
//         const kashmircity = rep_cities.create({
//           name: cityName,
//           province: azadKashmir,
//         });
//         await rep_cities.save(kashmircity);
//       }
//     }

//     /* Islamabad */
//     if (islamabadTerritory) {
//       const islamabad = rep_cities.create({
//         name: 'Islamabad',
//         province: islamabadTerritory,
//       });
//       await rep_cities.save(islamabad);
//     }

//     /* Feeding data in permissions */
//     const user_management = rep_permission.create({
//       name: 'user_management',
//     });
//     await rep_permission.save(user_management);

//     const user_update = rep_permission.create({ name: 'user_update' });
//     user_update.parent = user_management;
//     await rep_permission.save(user_update);

//     const user_delete = rep_permission.create({ name: 'user_delete' });
//     user_delete.parent = user_management;
//     await rep_permission.save(user_delete);

//     const user_create = rep_permission.create({ name: 'user_create' });
//     user_create.parent = user_management;
//     await rep_permission.save(user_create);

//     const user_view = rep_permission.create({ name: 'user_view' });
//     user_view.parent = user_management;
//     await rep_permission.save(user_view);

//     const user_list = rep_permission.create({ name: 'user_list' });
//     user_list.parent = user_management;
//     await rep_permission.save(user_list);

//     const user_assign_role = rep_permission.create({
//       name: 'user_assign_role',
//     });
//     user_assign_role.parent = user_management;
//     await rep_permission.save(user_assign_role);

//     const user_assigin_permission = rep_permission.create({
//       name: 'user_assign_permission',
//     });
//     user_assigin_permission.parent = user_management;
//     await rep_permission.save(user_assigin_permission);

//     const permission_management = rep_permission.create({
//       name: 'permission_management',
//     });
//     await rep_permission.save(permission_management);

//     const permission_list = rep_permission.create({ name: 'permission_list' });
//     permission_list.parent = permission_management;
//     await rep_permission.save(permission_list);

//     const role_management = rep_permission.create({ name: 'role_management' });
//     await rep_permission.save(role_management);

//     const role_list = rep_permission.create({ name: 'role_list' });
//     role_list.parent = role_management;
//     await rep_permission.save(role_list);

//     const role_assign_permission = rep_permission.create({
//       name: 'role_assign_permission',
//     });
//     role_assign_permission.parent = role_management;
//     await rep_permission.save(role_assign_permission);

//     /* Feeding role data */
//     const admin_role = await rep_role.save(rep_role.create({ name: 'admin' }));
//     const user_role = await rep_role.save(rep_role.create({ name: 'user' }));

//     /* Feeding user data */
//     const admin = rep_user.create({
//       name: 'Awais',
//       emp_id: '1',
//       email: 'admin@gmail.com',
//       password: '$2b$12$ZX9zjdCL5M2FDn.dv3xEWedW8ESUJMMO3UKiKf/u/2/WRhIK/ELnO',
//       phone: '03101234567',
//       verify_token: null,
//       is_email_verif: true,
//       login_token: null,
//       is_active: true,
//       isArchived: false,
//       roles: [admin_role],
//     });

//     await rep_user.save(admin);

//     // Feeding Location data
//     const city = await rep_cities.findOne({ where: { name: 'Islamabad' } });
//     const province = await rep_province.findOne({
//       where: { name: 'Islamabad' },
//     });
//     const locations = rep_location.create([
//       {
//         venueName: 'Marriott Hotel Islamabad',
//         address: 'Islamabad',
//         description: 'Please attend the ceremony',
//         mapUrl: 'https://www.google.com/travel/hotels/s/dtV9Ca1ZxAry3mbH6',
//         zipCode: 50010,
//         city: city,
//         province: province,
//       },
//       {
//         venueName: 'Serena',
//         address: 'Islamabad G-6',
//         description: 'Please attend the ceremony',
//         mapUrl: 'https://www.google.com/travel/hotels/s/XrhyrmcnKJQD6eBM7',
//         zipCode: 12071,
//         city: city,
//         province: province,
//       },
     
//     ]);

//     await rep_location.save(locations);

//     // Feeding phase data
//     const phases = rep_phase.create([
//       {
//         name: 'New',
//       },
//       {
//         name: 'Scheduled',
//       },
//       {
//         name: 'Processed',
//       },
//       {
//         name: 'Closed',
//       },
//     ]);

//     await rep_phase.save(phases);

//     // Feeding data of degree program
//     const degrees = [
//       {
//         abbreviation: 'BS',
//         title: 'Bachelor of Science (4 year) Programs',
//       },
//       {
//         abbreviation: 'MS',
//         title: 'Master of Science (2 year) Programs',
//       },
//       {
//         abbreviation: 'M.Phil',
//         title: 'Master of Philosophy (2 year) Programs',
//       },
//     ];

//     const BS = await rep_degree.save(rep_degree.create(degrees[0]));
//     const MS = await rep_degree.save(rep_degree.create(degrees[1]));
//     const ADP = await rep_degree.save(rep_degree.create(degrees[2]));
//     const Master = await rep_degree.save(rep_degree.create(degrees[3]));
//     const PHD = await rep_degree.save(rep_degree.create(degrees[4]));
//     const Diploma = await rep_degree.save(rep_degree.create(degrees[5]));
//     const PGD = await rep_degree.save(rep_degree.create(degrees[6]));
//     const M_Phil = await rep_degree.save(rep_degree.create(degrees[7]));

//     // BS Programs
//     if (BS) {
//       const BsPrograms = [
//         {
//           abbreviation: 'BSEco',
//           title: 'BS Economics',
//         },
//         {
//           abbreviation: 'BSMC',
//           title: 'BS Mass Communication',
//         },
//         {
//           abbreviation: 'BSPSY',
//           title: 'BS Psycology',
//         },
//         {
//           abbreviation: 'BSMATH',
//           title: 'BS Mathematics',
//         },
//         {
//           abbreviation: 'BSBIOI',
//           title: 'BS Bioinformatics',
//         },
//         {
//           abbreviation: 'BSBIOT',
//           title: 'BS Biotechnology',
//         },
//         {
//           abbreviation: 'BSZOO',
//           title: 'BS Zoology',
//         },
//       ];

//       for (const BSName of BsPrograms) {
//         const BSprogram = rep_studyProgram.create({
//           title: BSName.title,
//           abbreviation: BSName.abbreviation,
//           degrees: BS,
//         });
//         await rep_studyProgram.save(BSprogram);
//       }
//     }
//     // MS Programs
//     if (MS) {
//       const MsPrograms = [
//         {
//           abbreviation: 'MBEcon',
//           title: 'MS Business Economics',
//         },
//         {
//           abbreviation: 'MSMC',
//           title: 'MS Mass Communication',
//         },
//         {
//           abbreviation: 'MGEN',
//           title: 'MS Genetics',
//         },
//         {
//           abbreviation: 'MSTAT',
//           title: 'MS Statistics',
//         },
//       ];

//       for (const MSName of MsPrograms) {
//         const Msprogram = rep_studyProgram.create({
//           title: MSName.title,
//           abbreviation: MSName.abbreviation,
//           degrees: MS,
//         });
//         await rep_studyProgram.save(Msprogram);
//       }
//     }
//     // PHD Programs
//     if (PHD) {
//       const phdPrograms = [
//         {
//           abbreviation: 'PHDCS',
//           title: 'PHD Computer Science',
//         },
//         {
//           abbreviation: 'PHDBIOT',
//           title: 'PHD Biotechnology',
//         },
//       ];
//       for (const PHDName of phdPrograms) {
//         const PHDprogram = rep_studyProgram.create({
//           title: PHDName.title,
//           abbreviation: PHDName.abbreviation,
//           degrees: PHD,
//         });
//         await rep_studyProgram.save(PHDprogram);
//       }
//     }
//     // M.Phil Programs
//     if (M_Phil) {
//       const MphilPrograms = [
//         {
//           abbreviation: 'MPHILEDU',
//           title: 'PHD Education',
//         },
//       ];
//       for (const MphilName of MphilPrograms) {
//         const Mphilprogram = rep_studyProgram.create({
//           title: MphilName.title,
//           abbreviation: MphilName.abbreviation,
//           degrees: M_Phil,
//         });
//         await rep_studyProgram.save(Mphilprogram);
//       }
//     }

//     //Post Graduate Degree Program
//     if (PGD) {
//       const pgdPrograms = [
//         {
//           abbreviation: 'PGDPSY',
//           title: 'PGD Applied Psycology',
//         },
//         {
//           abbreviation: 'PGDTEL',
//           title: 'PGD Television Production',
//         },
//         {
//           abbreviation: 'PGDACC',
//           title: 'PGD in Accounting',
//         },
//         {
//           abbreviation: 'PGDMB',
//           title: 'PGD in Molecular Biology',
//         },
//       ];
//       for (const PGDName of pgdPrograms) {
//         const PGDprogram = rep_studyProgram.create({
//           title: PGDName.title,
//           abbreviation: PGDName.abbreviation,
//           degrees: PGD,
//         });
//         await rep_studyProgram.save(PGDprogram);
//       }
//     }

//     // Diploma Program
//     if (Diploma) {
//       const DiplomaPrograms = [
//         {
//           abbreviation: 'DACC',
//           title: 'Diploma in Accounting',
//         },
//         {
//           abbreviation: 'DACCF',
//           title: 'Diploma in Accounting and Finance',
//         },
//         {
//           abbreviation: 'DBANK',
//           title: 'Diploma in Banking and finance',
//         },
//         {
//           abbreviation: 'DPA',
//           title: 'Diploma in Public Administration',
//         },
//         {
//           abbreviation: 'DMB',
//           title: 'Diploma in Molecular Biology',
//         },
//       ];
//       for (const DiplomaName of DiplomaPrograms) {
//         const Diplomaprogram = rep_studyProgram.create({
//           title: DiplomaName.title,
//           abbreviation: DiplomaName.abbreviation,
//           degrees: Diploma,
//         });
//         await rep_studyProgram.save(Diplomaprogram);
//       }
//     }
//     const departmentNames = [
//       'Department of Economics',
//       'Department of English',
//       'Department of Mass Communication',
//       'Department of Molecular Biology',
//       'Department of Statistics',
//       'Guest of Honour',
//     ];
//     for (const departmentName of departmentNames) {
//       const foundDepartment = await rep_department.findOne({
//         where: { name: departmentName },
//       });
//       if (foundDepartment) {
//         continue;
//       }
//       const department = rep_department.create({
//         name: departmentName,
//       });
//       await rep_department.save(department);
//     }
//     const designationNames = [
//       'Professor',
//       'Associate Professor',
//       'Assistant Professor',
//       'Lecturer',
//       'eLecturer',
//       'Guest of Honour',
//     ];
//     for (const designationName of designationNames) {
//       const foundDesignation = await rep_designation.findOne({
//         where: { name: designationName },
//       });
//       if (foundDesignation) {
//         continue;
//       }
//       const designation = rep_designation.create({
//         name: designationName,
//       });
//       await rep_designation.save(designation);
//     }

//     const rep_staffRole = dataSource.getRepository(StaffRole);

//     // Check if staff roles already exist
//     const existingRoles = await rep_staffRole.find();
//     if (existingRoles.length === 0) {
//       const staffRoles = [
//         { name: 'guest' },
//         { name: 'presenter' },
//         { name: 'employee' },
//       ];
//       await rep_staffRole.save(rep_staffRole.create(staffRoles));
//     }
//   }
// }
