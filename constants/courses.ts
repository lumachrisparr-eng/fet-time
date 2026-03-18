export interface Course {
  code: string;
  name: string;
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  time: string;
  hall: string;
  lecturer: string;
  dept: 'CEN' | 'EEN' | 'CIV' | 'MEF' | 'CPE';
  level: 200 | 300 | 400 | 500;
}

// FET Timetable — 2nd Semester 2025/2026
// University of Buea — Faculty of Engineering and Technology
// Auto-extracted from official timetable PDF
// Total: 225 entries

export const COURSES: Course[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── MONDAY ───────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════

  // CEN (CEF) Courses
  { code: "CEF238", name: "C/C++ Programming", day: "MON", time: "09:00-11:00", hall: "FET-BGFL", lecturer: "Dr. Nguti", dept: "CEN", level: 200 },
  { code: "CEF238", name: "C/C++ Programming", day: "MON", time: "11:00-13:00", hall: "FET-BGFL", lecturer: "Dr. Nguti", dept: "CEN", level: 200 },

  // CIV Courses
  { code: "CIV408", name: "Geotechnics Lab I", day: "MON", time: "09:00-11:00", hall: "PG-LR5", lecturer: "Lontsi A./ Njike/ Kila", dept: "CIV", level: 400 },
  { code: "CIV408", name: "Geotechnics Lab I", day: "MON", time: "11:00-13:00", hall: "PG-LR5", lecturer: "Lontsi A./ Njike/ Kila", dept: "CIV", level: 400 },

  // EEN (EEF) Courses
  { code: "EEF368", name: "Microcontrollers and Microprocessors", day: "MON", time: "09:00-11:00", hall: "EE Laboratory", lecturer: "Prof. Tsafack/ Prof. Ngwashi/ Dr. Tabetah", dept: "EEN", level: 300 },
  { code: "EEF368", name: "Microcontrollers and Microprocessors", day: "MON", time: "11:00-13:00", hall: "EE Laboratory", lecturer: "Prof. Tsafack/ Prof. Ngwashi/ Dr. Tabetah", dept: "EEN", level: 300 },
  { code: "EEF460", name: "Feedback Systems Laboratory", day: "MON", time: "13:00-15:00", hall: "EE Laboratory", lecturer: "Dr. Wirnkar/ Dr. Musong/ Dr. Ayuketah", dept: "EEN", level: 400 },
  { code: "EEF460", name: "Feedback Systems Laboratory", day: "MON", time: "15:00-17:00", hall: "EE Laboratory", lecturer: "Dr. Wirnkar/ Dr. Musong/ Dr. Ayuketah", dept: "EEN", level: 400 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── TUESDAY ──────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════

  // CEN (CEF) Courses - Morning
  { code: "CEF444", name: "Artificial Intelligence and Machine Learning", day: "TUE", time: "07:00-09:00", hall: "FET-BFF-HALL2", lecturer: "Prof. Fute/ Dr. Sop", dept: "CEN", level: 400 },
  { code: "CEF342", name: "Database and Design", day: "TUE", time: "07:00-09:00", hall: "FET-TECH3", lecturer: "Eng. Kingue Patrick", dept: "CEN", level: 300 },
  { code: "CEF254", name: "Algebra", day: "TUE", time: "11:00-13:00", hall: "FET-BGFL", lecturer: "Dr. Dor C.", dept: "CEN", level: 200 },
  { code: "CEF462", name: "Digital Image Processing", day: "TUE", time: "11:00-13:00", hall: "FET-TECH1", lecturer: "Dr. Sop Deffo", dept: "CEN", level: 400 },
  { code: "CEF356", name: "Mobile Communications and Protocols", day: "TUE", time: "11:00-13:00", hall: "FET-BFF-HALL1", lecturer: "Dr. Nkemeni", dept: "CEN", level: 300 },
  { code: "CEF344", name: "Client-Server and Web Application Development", day: "TUE", time: "13:00-15:00", hall: "PG-LR5", lecturer: "Dr. Sop Deffo", dept: "CEN", level: 300 },
  { code: "CEF250", name: "Computer Architecture", day: "TUE", time: "13:00-15:00", hall: "FET-BGFL", lecturer: "Mr. Forcha Glen", dept: "CEN", level: 200 },
  { code: "CEF472", name: "Human Computer Interface", day: "TUE", time: "09:00-11:00", hall: "FET-TECH1", lecturer: "Dr. Djouela Inès", dept: "CEN", level: 400 },
  { code: "CEF440", name: "Internet Programming (J2EE) and Mobile Programming", day: "TUE", time: "15:00-17:00", hall: "FET-BGFL", lecturer: "Dr. Nkemeni V.", dept: "CEN", level: 400 },
  { code: "CEF440", name: "Internet Programming (J2EE) and Mobile Programming", day: "TUE", time: "17:00-19:00", hall: "FET-BGFL", lecturer: "Dr. Nkemeni V.", dept: "CEN", level: 400 },

  // MEF Courses
  { code: "MEF204", name: "Basics of Mechanical Drawing", day: "TUE", time: "07:00-09:00", hall: "FET-BFF-HALL1", lecturer: "Dr. Temgoua/ Dr. Aquigeh", dept: "MEF", level: 200 },
  { code: "MEF480", name: "Basics of Automobile Mechanics", day: "TUE", time: "09:00-11:00", hall: "FET-TECH2", lecturer: "Aquigeh", dept: "MEF", level: 400 },
  { code: "MEF410", name: "Metrology and Quality Control", day: "TUE", time: "13:00-15:00", hall: "FET-BFF-HALL1", lecturer: "Ateuafack (COT)", dept: "MEF", level: 400 },
  { code: "MEF414", name: "CNC Machining", day: "TUE", time: "13:00-15:00", hall: "FET-TECH2", lecturer: "Azeufack", dept: "MEF", level: 400 },
  { code: "MEF240", name: "Introduction to Thermodynamics", day: "TUE", time: "13:00-15:00", hall: "FET-TECH1", lecturer: "Prof. Fopah-Lele/ Dr. Temgoua", dept: "MEF", level: 200 },
  { code: "MEF594", name: "Entrepreneurship", day: "TUE", time: "15:00-17:00", hall: "FET-BFF-HALL2", lecturer: "Dr. Nouadjep Serge", dept: "MEF", level: 500 },
  { code: "MEF354", name: "Thermodynamics", day: "TUE", time: "15:00-17:00", hall: "FET-TECH2", lecturer: "Temgoua Djouatsa Diane Estelle", dept: "MEF", level: 300 },
  { code: "MEF480", name: "Basics of Automobile Mechanics", day: "TUE", time: "15:00-17:00", hall: "FET-BFF-HALL1", lecturer: "Aquigeh", dept: "MEF", level: 400 },
  { code: "MEF476", name: "Technical Writing", day: "TUE", time: "17:00-19:00", hall: "PG-LR5", lecturer: "Prof. Fopah-Lele/ Dr. Temgoua", dept: "MEF", level: 400 },

  // CIV Courses
  { code: "CIV214", name: "Chemistry II", day: "TUE", time: "07:00-09:00", hall: "FET-TECH1", lecturer: "Tchetgnia Ngassam Ines Leana", dept: "CIV", level: 200 },
  { code: "CIV310", name: "Thermodynamics", day: "TUE", time: "07:00-09:00", hall: "PG-LR5", lecturer: "Dr. Lontsi Agostiny Marrios", dept: "CIV", level: 300 },
  { code: "CIV506", name: "Geotechnics Lab II", day: "TUE", time: "09:00-11:00", hall: "CIV-LAB", lecturer: "Njike Manette/ Tata Sunjo/ Agbor/ Feumoe/ Kila", dept: "CIV", level: 500 },
  { code: "CIV402", name: "Reinforced Concrete I", day: "TUE", time: "09:00-11:00", hall: "FET-BGFL", lecturer: "Chia E.", dept: "CIV", level: 400 },
  { code: "CIV506", name: "Geotechnics Lab II", day: "TUE", time: "11:00-13:00", hall: "CIV-LAB", lecturer: "Njike Manette/ Tata Sunjo/ Agbor/ Feumoe/ Kila", dept: "CIV", level: 500 },
  { code: "CIV202", name: "Materials Science & Technology", day: "TUE", time: "11:00-13:00", hall: "FET-TECH2", lecturer: "Tchetgnia Ngassam Ines Leana", dept: "CIV", level: 200 },
  { code: "CIV342", name: "Architectural Drawing", day: "TUE", time: "11:00-13:00", hall: "FET-TECH2", lecturer: "Goodwill N.", dept: "CIV", level: 300 },
  { code: "CIV404", name: "Fluid Mechanics and Hydraulic Constructions", day: "TUE", time: "13:00-15:00", hall: "FET-TECH4", lecturer: "Lontsi Agostiny Marrios", dept: "CIV", level: 400 },
  { code: "CIV324", name: "Health, Safety, Security and Environment (HSSE)", day: "TUE", time: "13:00-15:00", hall: "FET-TECH3", lecturer: "Dr. Ngassam/ Dr. Mwebi", dept: "CIV", level: 300 },
  { code: "CIV422", name: "Structural Analysis II: Indeterminate Structure", day: "TUE", time: "15:00-17:00", hall: "PG-LR5", lecturer: "Njike M./ Kila S.", dept: "CIV", level: 400 },
  { code: "CIV324", name: "Health, Safety, Security and Environment (HSSE)", day: "TUE", time: "15:00-17:00", hall: "FET-TECH3", lecturer: "Dr. Ngassam/ Dr. Mwebi", dept: "CIV", level: 300 },
  { code: "CIV222", name: "General Algebra and Affine Geometry", day: "TUE", time: "17:00-19:00", hall: "FET-BFF-HALL1", lecturer: "Agbor D./ Feumoe Narcisse Alain", dept: "CIV", level: 200 },
  { code: "CIV504", name: "Structural Analysis and Design", day: "TUE", time: "17:00-19:00", hall: "FET-TECH1", lecturer: "Dr. Njike/ Chia", dept: "CIV", level: 500 },

  // EEN (EEF) Courses
  { code: "EEF262", name: "Physics for Engineering II", day: "TUE", time: "07:00-09:00", hall: "FET-BGFL", lecturer: "Dr. Job/ Dr. Tabetah", dept: "EEN", level: 200 },
  { code: "EEF364", name: "Basic Telecommunications", day: "TUE", time: "07:00-09:00", hall: "FET-TECH4", lecturer: "Dr. Nkemeni/ Mr. Forcha Glen", dept: "EEN", level: 300 },
  { code: "EEF462", name: "Digital Signal Processing", day: "TUE", time: "09:00-11:00", hall: "FET-TECH3", lecturer: "Sitamtze Youmbi Bertrand", dept: "EEN", level: 400 },
  { code: "EEF480", name: "Control of Electrical Machines", day: "TUE", time: "09:00-11:00", hall: "FET-TECH4", lecturer: "Dr. Fotso", dept: "EEN", level: 400 },
  { code: "EEF464", name: "Wireless and Mobile Communications", day: "TUE", time: "11:00-13:00", hall: "FET-BFF-HALL2", lecturer: "Dr. Sitamtze Youmbi Bertrand", dept: "EEN", level: 400 },
  { code: "EEF482", name: "Electric Machines II", day: "TUE", time: "13:00-15:00", hall: "FET-BFF-HALL2", lecturer: "Fotso Mbobda Christophe Raoul", dept: "EEN", level: 400 },
  { code: "EEF366", name: "Sequence Control", day: "TUE", time: "15:00-17:00", hall: "FET-TECH1", lecturer: "Dr. Nouadjep/ Dr. Musong", dept: "EEN", level: 300 },
  { code: "EEF466", name: "Antenna and Propagation", day: "TUE", time: "15:00-17:00", hall: "FET-TECH4", lecturer: "Engr. Baar David", dept: "EEN", level: 400 },
  { code: "FET596", name: "Entrepreneurship Project", day: "TUE", time: "17:00-19:00", hall: "FET-TECH2", lecturer: "Dr. Nkemeni/ Engr. Fongoh", dept: "EEN", level: 500 },

  // CPE Courses
  { code: "CPE208", name: "Chemical Process Principle", day: "TUE", time: "07:00-09:00", hall: "FET-TECH2", lecturer: "Dr. Teiseh", dept: "CPE", level: 200 },
  { code: "CPE302", name: "Health Safety and Environment", day: "TUE", time: "09:00-11:00", hall: "FET-BFF-HALL1", lecturer: "Dr. Boukanda", dept: "CPE", level: 300 },
  { code: "CPE212", name: "General Geology", day: "TUE", time: "11:00-13:00", hall: "PG-LR5", lecturer: "Mr. Ayuk", dept: "CPE", level: 200 },
  { code: "CPE304", name: "Reservoir Engineering", day: "TUE", time: "11:00-13:00", hall: "FET-TECH3", lecturer: "Dr. Victor Wotanie/ Mr. Ayuk Samuel", dept: "CPE", level: 300 },

  // MEF Additional
  { code: "MEF360", name: "Fluid Mechanics II", day: "TUE", time: "09:00-11:00", hall: "PG-LR5", lecturer: "Dr. Azeufack/ Dr. Simo", dept: "MEF", level: 300 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── WEDNESDAY ────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════

  // CEN (CEF) Courses
  { code: "CEF438", name: "Advanced Databases and Administration (Oracle/MySQL)", day: "WED", time: "07:00-09:00", hall: "FET-BFF-HALL2", lecturer: "Dr. Kamdjou", dept: "CEN", level: 400 },
  { code: "CEF432", name: "Network Security Fundamentals", day: "WED", time: "07:00-09:00", hall: "FET-TECH3", lecturer: "Dr. Tsague A.", dept: "CEN", level: 400 },
  { code: "CEF468", name: "Database and PHP Programming", day: "WED", time: "09:00-11:00", hall: "FET-BFF-HALL1", lecturer: "Eng. Djotchuang Karl/ Forcha Glen Beloa", dept: "CEN", level: 400 },
  { code: "CEF476", name: "Software Engineering and Design", day: "WED", time: "09:00-11:00", hall: "FET-TECH3", lecturer: "Dr. Kamdjou/ Dr. Tsague", dept: "CEN", level: 400 },
  { code: "CEF468", name: "Database and PHP Programming", day: "WED", time: "11:00-13:00", hall: "FET-BFF-HALL1", lecturer: "Eng. Djotchuang Karl/ Forcha Glen Beloa", dept: "CEN", level: 400 },
  { code: "CEF476", name: "Software Engineering and Design", day: "WED", time: "11:00-13:00", hall: "FET-TECH3", lecturer: "Dr. Kamdjou/ Dr. Tsague", dept: "CEN", level: 400 },
  { code: "CEF478", name: "Network Administration", day: "WED", time: "11:00-13:00", hall: "FET-TECH1", lecturer: "Mr. Forcha Glen", dept: "CEN", level: 400 },
  { code: "CEF438", name: "Advanced Databases and Administration (Oracle/MySQL)", day: "WED", time: "15:00-17:00", hall: "PG-LR5", lecturer: "Dr. Kamdjou", dept: "CEN", level: 400 },
  { code: "CEF432", name: "Network Security Fundamentals", day: "WED", time: "15:00-17:00", hall: "FET-TECH3", lecturer: "Dr. Tsague A.", dept: "CEN", level: 400 },
  { code: "CEF478", name: "Network Administration", day: "WED", time: "17:00-19:00", hall: "FET-BFF-HALL2", lecturer: "Mr. Forcha Glen", dept: "CEN", level: 400 },

  // EEN (EEF) Courses
  { code: "EEF262", name: "Physics for Engineering II", day: "WED", time: "07:00-09:00", hall: "FET-BGFL", lecturer: "Dr. Djob/ Dr. Tabetah", dept: "EEN", level: 200 },
  { code: "EEF362", name: "Analog Electronics Laboratory", day: "WED", time: "07:00-09:00", hall: "EE Laboratory", lecturer: "Tsafack P./ Musong/ Fendji", dept: "EEN", level: 300 },
  { code: "EEF362", name: "Analog Electronics Laboratory", day: "WED", time: "09:00-11:00", hall: "EE Laboratory", lecturer: "Tsafack P./ Musong/ Fendji", dept: "EEN", level: 300 },
  { code: "EEF262", name: "Physics for Engineering II", day: "WED", time: "09:00-11:00", hall: "FET-BGFL", lecturer: "Dr. Djob/ Dr. Tabetah", dept: "EEN", level: 200 },
  { code: "EEF262", name: "Physics for Engineering II", day: "WED", time: "11:00-13:00", hall: "FET-BGFL", lecturer: "Dr. Djob/ Dr. Tabetah", dept: "EEN", level: 200 },
  { code: "EEF262", name: "Physics for Engineering II", day: "WED", time: "15:00-17:00", hall: "FET-BGFL", lecturer: "Dr. Djob/ Dr. Tabetah", dept: "EEN", level: 200 },
  { code: "EEF262", name: "Physics for Engineering II", day: "WED", time: "17:00-19:00", hall: "FET-BGFL", lecturer: "Dr. Djob/ Dr. Tabetah", dept: "EEN", level: 200 },

  // MEF Courses
  { code: "MEF490", name: "Engineering Economy", day: "WED", time: "07:00-09:00", hall: "FET-TECH2", lecturer: "Dr. Seppo", dept: "MEF", level: 400 },
  { code: "MEF302", name: "Design 2: Machine Element Design", day: "WED", time: "07:00-09:00", hall: "PG-LR5", lecturer: "Dr. Awa", dept: "MEF", level: 300 },
  { code: "MEF302", name: "Design 2: Machine Element Design", day: "WED", time: "09:00-11:00", hall: "PG-LR5", lecturer: "Dr. Awa", dept: "MEF", level: 300 },
  { code: "MEF490", name: "Engineering Economy", day: "WED", time: "15:00-17:00", hall: "FET-TECH2", lecturer: "Dr. Seppo", dept: "MEF", level: 400 },
  { code: "MEF484", name: "Mechanical Laboratory II", day: "WED", time: "15:00-17:00", hall: "CIV Laboratory", lecturer: "Fopah/ Azeufack/ Simo/ AVTC-Limbe", dept: "MEF", level: 400 },
  { code: "MEF484", name: "Mechanical Laboratory II", day: "WED", time: "17:00-19:00", hall: "CIV Laboratory", lecturer: "Fopah/ Azeufack/ Simo/ AVTC-Limbe", dept: "MEF", level: 400 },

  // CIV Courses
  { code: "CIV346", name: "Soil Mechanics", day: "WED", time: "07:00-09:00", hall: "FET-TECH1", lecturer: "Dr. Lontsi A./ Dr. Feumoe A.", dept: "CIV", level: 300 },
  { code: "CIV426", name: "Structural Design", day: "WED", time: "07:00-09:00", hall: "FET-BFF-HALL1", lecturer: "Njike Manette", dept: "CIV", level: 400 },
  { code: "CIV348", name: "Road and Various Networks", day: "WED", time: "11:00-13:00", hall: "PG-LR5", lecturer: "Dr. Meh A.", dept: "CIV", level: 300 },
  { code: "CIV502", name: "Reinforced Concrete 2", day: "WED", time: "11:00-13:00", hall: "FET-TECH4", lecturer: "Njike Manette/ Kang Cedric", dept: "CIV", level: 500 },
  { code: "CIV346", name: "Soil Mechanics", day: "WED", time: "15:00-17:00", hall: "FET-TECH1", lecturer: "Dr. Lontsi A./ Dr. Feumoe A.", dept: "CIV", level: 300 },
  { code: "CIV426", name: "Structural Design", day: "WED", time: "15:00-17:00", hall: "FET-BFF-HALL1", lecturer: "Njike Manette", dept: "CIV", level: 400 },
  { code: "CIV502", name: "Reinforced Concrete 2", day: "WED", time: "17:00-19:00", hall: "PG-LR5", lecturer: "Njike Manette/ Kang Cedric", dept: "CIV", level: 500 },
  { code: "CIV348", name: "Road and Various Networks", day: "WED", time: "17:00-19:00", hall: "FET-BFF-HALL1", lecturer: "Dr. Meh A.", dept: "CIV", level: 300 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── THURSDAY ─────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════

  // CEN (CEF) Courses
  { code: "CEF346", name: "Object Oriented Programming (JAVA/C++)", day: "THU", time: "09:00-11:00", hall: "PG-LR5", lecturer: "Dr. Djouela", dept: "CEN", level: 300 },
  { code: "CEF350", name: "Security and Cryptosystem", day: "THU", time: "09:00-11:00", hall: "FET-TECH1", lecturer: "Dr. Tsague A.", dept: "CEN", level: 300 },
  { code: "CEF352", name: "Tools and Numerical Methods for Engineering", day: "THU", time: "11:00-13:00", hall: "FET-TECH2", lecturer: "Dr. Wati/ Dr. Azeufack", dept: "CEN", level: 300 },
  { code: "CEF450", name: "Cloud Computing and Service Oriented Architectures", day: "THU", time: "11:00-13:00", hall: "PG-LR5", lecturer: "Dr. Djouela Inès", dept: "CEN", level: 400 },
  { code: "CEF482", name: "XML and Document Content Description", day: "THU", time: "13:00-15:00", hall: "FET-BFF-HALL1", lecturer: "Dr. Sop", dept: "CEN", level: 400 },
  { code: "CEF488", name: "System and Network Programming", day: "THU", time: "13:00-15:00", hall: "PG-LR5", lecturer: "Mr. Forcha Glen", dept: "CEN", level: 400 },
  { code: "CEF354", name: "Switching and Routing Protocols", day: "THU", time: "15:00-17:00", hall: "PG-LR5", lecturer: "Dr. Nkemeni V./ Dr. Nguti", dept: "CEN", level: 300 },
  { code: "CEF474", name: "Software Verification and Validation Techniques", day: "THU", time: "17:00-19:00", hall: "FET-BFF-HALL1", lecturer: "Dr. Tsague A.", dept: "CEN", level: 400 },
  { code: "CEF458", name: "Enterprise IP and Telephony and Video Network", day: "THU", time: "17:00-19:00", hall: "PG-LR5", lecturer: "Dr. Kamdjou", dept: "CEN", level: 400 },

  // MEF Courses
  { code: "MEF416", name: "Basics of Industrial Automation", day: "THU", time: "07:00-09:00", hall: "FET-TECH2", lecturer: "", dept: "MEF", level: 400 },
  { code: "MEF450", name: "Hydraulics and Pneumatics", day: "THU", time: "07:00-09:00", hall: "PG-LR5", lecturer: "Ejuh Che", dept: "MEF", level: 400 },
  { code: "MEF486", name: "Basic of Mechatronics", day: "THU", time: "07:00-09:00", hall: "FET-TECH3", lecturer: "Dr. Simo Domguia/ Dr. Wamba", dept: "MEF", level: 400 },
  { code: "MEF366", name: "Heat Transfer", day: "THU", time: "09:00-11:00", hall: "FET-TECH3", lecturer: "Dr. Temgoua/ Prof. Fopah-Lele", dept: "MEF", level: 300 },
  { code: "MEF420", name: "Introduction to Machine Learning", day: "THU", time: "11:00-13:00", hall: "FET-BFF-HALL2", lecturer: "Dr. Wamba", dept: "MEF", level: 400 },
  { code: "MEF460", name: "Design Graphics for Mechanical Engineering", day: "THU", time: "11:00-13:00", hall: "FET-TECH1", lecturer: "Dr. Aquigeh Newen", dept: "MEF", level: 400 },
  { code: "MEF268", name: "Electrical Engineering for Mechanical Engineers", day: "THU", time: "11:00-13:00", hall: "FET-TECH3", lecturer: "Simo Domguia Ulrich", dept: "MEF", level: 200 },
  { code: "MEF368", name: "Design and Operation of Chemical Apparatus", day: "THU", time: "13:00-15:00", hall: "FET-TECH1", lecturer: "Nouadjep Serge", dept: "MEF", level: 300 },
  { code: "MEF464", name: "Heating, Ventilation and Air Conditioning", day: "THU", time: "13:00-15:00", hall: "FET-TECH3", lecturer: "Dr. Aquigeh Newen", dept: "MEF", level: 400 },
  { code: "MEF482", name: "Design of Pressure Vessels", day: "THU", time: "13:00-15:00", hall: "FET-TECH4", lecturer: "Ateuafack", dept: "MEF", level: 400 },
  { code: "MEF370", name: "Process Technology & Design", day: "THU", time: "15:00-17:00", hall: "FET-BFF-HALL2", lecturer: "Dr. Tsamo Nestor", dept: "MEF", level: 300 },
  { code: "MEF470", name: "Embedded Application Design and Interfacing", day: "THU", time: "17:00-19:00", hall: "FET-TECH2", lecturer: "Ejuh Che", dept: "MEF", level: 400 },

  // CIV Courses
  { code: "CIV410", name: "Fundamentals of Building Information Management (BIM)", day: "THU", time: "07:00-09:00", hall: "FET-BFF-HALL1", lecturer: "Mr. Kang Cederic/ Chia", dept: "CIV", level: 400 },
  { code: "CIV234", name: "Introduction to Architecture", day: "THU", time: "09:00-11:00", hall: "FET-BFF-HALL1", lecturer: "Mackongo Jean Christian", dept: "CIV", level: 200 },
  { code: "CIV334", name: "Strength of Materials", day: "THU", time: "09:00-11:00", hall: "FET-TECH4", lecturer: "Njike Manette/ Kila", dept: "CIV", level: 300 },
  { code: "CIV234", name: "Introduction to Architecture", day: "THU", time: "11:00-13:00", hall: "FET-TECH4", lecturer: "Mackongo Jean Christian", dept: "CIV", level: 200 },
  { code: "CIV340", name: "Technical Writing", day: "THU", time: "13:00-15:00", hall: "FET-TECH2", lecturer: "Prof. Tata S./ Dr. Mwebi", dept: "CIV", level: 300 },
  { code: "CIV416", name: "Introduction to Urbanism and Transport", day: "THU", time: "13:00-15:00", hall: "FET-BGFL", lecturer: "Tata Sunjo/ Meh A.", dept: "CIV", level: 400 },
  { code: "CIV228", name: "Programming and Application Software", day: "THU", time: "15:00-17:00", hall: "FET-TECH2", lecturer: "Dr. Nouadjep Serge", dept: "CIV", level: 200 },
  { code: "CIV318", name: "Building Services", day: "THU", time: "15:00-17:00", hall: "FET-BFF-HALL1", lecturer: "Mackongo Jean Christian/ Kang Cederic", dept: "CIV", level: 300 },
  { code: "CIV318", name: "Building Services", day: "THU", time: "17:00-19:00", hall: "FET-TECH1", lecturer: "Mackongo Jean Christian/ Kang Cederic", dept: "CIV", level: 300 },
  { code: "CIV418", name: "Quality, Safety, and Environmental Management", day: "THU", time: "17:00-19:00", hall: "FET-BGFL", lecturer: "Ngassam Ines/ Mwebi Clautaire", dept: "CIV", level: 400 },

  // EEN (EEF) Courses
  { code: "EEF484", name: "Electrical Power Systems Engineering II", day: "THU", time: "07:00-09:00", hall: "FET-TECH1", lecturer: "Fotso Mbobda Christophe Raoul/ Ayuketah", dept: "EEN", level: 400 },
  { code: "EEF260", name: "Analog Electronics I", day: "THU", time: "07:00-09:00", hall: "FET-TECH4", lecturer: "Dr. Tabeta Marshall", dept: "EEN", level: 200 },
  { code: "EEF474", name: "Coding Theory", day: "THU", time: "09:00-11:00", hall: "FET-TECH2", lecturer: "Mr. Ajua Columbus", dept: "EEN", level: 400 },
  { code: "EEF268", name: "Digital Electronics II", day: "THU", time: "11:00-13:00", hall: "FET-BGFL", lecturer: "Wirnkar Basil Nsanyuy/ Ayuketah Yvan", dept: "EEN", level: 200 },
  { code: "EEF264", name: "Control Engineering Instrumentation", day: "THU", time: "15:00-17:00", hall: "FET-TECH1", lecturer: "Dr. Nouadjep", dept: "EEN", level: 200 },
  { code: "EEF360", name: "Systems Simulation and PCB Design Techniques", day: "THU", time: "15:00-17:00", hall: "FET-BGFL", lecturer: "Prof. Ngwashi/ Dr. Tabetah", dept: "EEN", level: 300 },
  { code: "EEF360", name: "Systems Simulation and PCB Design Techniques", day: "THU", time: "17:00-19:00", hall: "FET-BGFL", lecturer: "Prof. Ngwashi/ Dr. Tabetah", dept: "EEN", level: 300 },
  { code: "EEF490", name: "Hybrid Energy Components and Systems", day: "THU", time: "11:00-13:00", hall: "FET-BFF-HALL1", lecturer: "Prof. Fopah/ Dr. Wati", dept: "EEN", level: 400 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── FRIDAY ───────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════════

  // CEN (CEF) Courses
  { code: "CEF444", name: "Artificial Intelligence and Machine Learning", day: "FRI", time: "07:00-09:00", hall: "FET-BGFL", lecturer: "Prof. Fute/ Dr. Sop", dept: "CEN", level: 400 },
  { code: "CEF342", name: "Database and Design", day: "FRI", time: "07:00-09:00", hall: "FET-TECH3", lecturer: "Eng. Kingue Patrick", dept: "CEN", level: 300 },
  { code: "CEF472", name: "Human Computer Interface", day: "FRI", time: "09:00-11:00", hall: "FET-TECH1", lecturer: "Dr. Djouela Inès", dept: "CEN", level: 400 },
  { code: "CEF364", name: "Local Area Computer Network", day: "FRI", time: "09:00-11:00", hall: "FET-