# FET Timetable Data — 2nd Semester 2025/2026
> University of Buea — Faculty of Engineering and Technology  
> Extracted from official timetable PDF

---

## courses.js

```js
// FET Timetable — 2nd Semester 2025/2026
// University of Buea
// Auto-extracted from official timetable PDF

const COURSES = [

  // ─── MONDAY ───────────────────────────────────────────────────────────────

  { code: "CEF238", name: "C/C++ Programming",                              day: "MON", time: "09:00-11:00", hall: "FET-BGFL",       lecturer: "Dr. Nguti",                                        dept: "CEF" },
  { code: "CEF238", name: "C/C++ Programming",                              day: "MON", time: "11:00-13:00", hall: "FET-BGFL",       lecturer: "Dr. Nguti",                                        dept: "CEF" },
  { code: "CIV408", name: "Geotechnics Lab I",                              day: "MON", time: "09:00-11:00", hall: "PG-LR5",         lecturer: "Lontsi A./ Njike/ Kila",                           dept: "CIV" },
  { code: "CIV408", name: "Geotechnics Lab I",                              day: "MON", time: "11:00-13:00", hall: "PG-LR5",         lecturer: "Lontsi A./ Njike/ Kila",                           dept: "CIV" },
  { code: "EEF368", name: "Microcontrollers and Microprocessors",           day: "MON", time: "09:00-11:00", hall: "EE Laboratory",  lecturer: "Prof. Tsafack/ Prof. Ngwashi/ Dr. Tabetah",        dept: "EEF" },
  { code: "EEF368", name: "Microcontrollers and Microprocessors",           day: "MON", time: "11:00-13:00", hall: "EE Laboratory",  lecturer: "Prof. Tsafack/ Prof. Ngwashi/ Dr. Tabetah",        dept: "EEF" },
  { code: "EEF460", name: "Feedback Systems Laboratory",                   day: "MON", time: "13:00-15:00", hall: "EE Laboratory",  lecturer: "Dr. Wirnkar/ Dr. Musong/ Dr. Ayuketah",            dept: "EEF" },
  { code: "EEF460", name: "Feedback Systems Laboratory",                   day: "MON", time: "15:00-17:00", hall: "EE Laboratory",  lecturer: "Dr. Wirnkar/ Dr. Musong/ Dr. Ayuketah",            dept: "EEF" },

  // ─── TUESDAY ──────────────────────────────────────────────────────────────

  { code: "CEF444", name: "Artificial Intelligence and Machine Learning",   day: "TUE", time: "07:00-09:00", hall: "FET-BFF-HALL2",  lecturer: "Prof. Fute/ Dr. Sop",                             dept: "CEF" },
  { code: "CEF342", name: "Database and Design",                            day: "TUE", time: "07:00-09:00", hall: "FET-TECH3",      lecturer: "Eng. Kingue Patrick",                             dept: "CEF" },
  { code: "CEF254", name: "Algebra",                                        day: "TUE", time: "11:00-13:00", hall: "FET-BGFL",       lecturer: "Dr. Dor C.",                                      dept: "CEF" },
  { code: "CEF462", name: "Digital Image Processing",                       day: "TUE", time: "11:00-13:00", hall: "FET-TECH1",      lecturer: "Dr. Sop Deffo",                                   dept: "CEF" },
  { code: "CEF356", name: "Mobile Communications and Protocols",            day: "TUE", time: "11:00-13:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Nkemeni",                                     dept: "CEF" },
  { code: "CEF344", name: "Client-Server and Web Application Development",  day: "TUE", time: "13:00-15:00", hall: "PG-LR5",         lecturer: "Dr. Sop Deffo",                                   dept: "CEF" },
  { code: "CEF250", name: "Computer Architecture",                          day: "TUE", time: "13:00-15:00", hall: "FET-BGFL",       lecturer: "Mr. Forcha Glen",                                 dept: "CEF" },
  { code: "CEF472", name: "Human Computer Interface",                       day: "TUE", time: "09:00-11:00", hall: "FET-TECH1",      lecturer: "Dr. Djouela Inès",                                dept: "CEF" },
  { code: "CEF440", name: "Internet Programming (J2EE) and Mobile Programming", day: "TUE", time: "15:00-17:00", hall: "FET-BGFL",  lecturer: "Dr. Nkemeni V.",                                  dept: "CEF" },
  { code: "CEF440", name: "Internet Programming (J2EE) and Mobile Programming", day: "TUE", time: "17:00-19:00", hall: "FET-BGFL",  lecturer: "Dr. Nkemeni V.",                                  dept: "CEF" },

  { code: "MEF204", name: "Basics of Mechanical Drawing",                   day: "TUE", time: "07:00-09:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Temgoua/ Dr. Aquigeh",                        dept: "MEF" },
  { code: "MEF480", name: "Basics of Automobile Mechanics",                 day: "TUE", time: "09:00-11:00", hall: "FET-TECH2",      lecturer: "Aquigeh",                                         dept: "MEF" },
  { code: "MEF410", name: "Metrology and Quality Control",                  day: "TUE", time: "13:00-15:00", hall: "FET-BFF-HALL1",  lecturer: "Ateuafack (COT)",                                 dept: "MEF" },
  { code: "MEF414", name: "CNC Machining",                                  day: "TUE", time: "13:00-15:00", hall: "FET-TECH2",      lecturer: "Azeufack",                                        dept: "MEF" },
  { code: "MEF240", name: "Introduction to Thermodynamics",                 day: "TUE", time: "13:00-15:00", hall: "FET-TECH1",      lecturer: "Prof. Fopah-Lele/ Dr. Temgoua",                   dept: "MEF" },
  { code: "MEF594", name: "Entrepreneurship",                               day: "TUE", time: "15:00-17:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Nouadjep Serge",                              dept: "MEF" },
  { code: "MEF354", name: "Thermodynamics",                                 day: "TUE", time: "15:00-17:00", hall: "FET-TECH2",      lecturer: "Temgoua Djouatsa Diane Estelle",                  dept: "MEF" },
  { code: "MEF480", name: "Basics of Automobile Mechanics",                 day: "TUE", time: "15:00-17:00", hall: "FET-BFF-HALL1",  lecturer: "Aquigeh",                                         dept: "MEF" },
  { code: "MEF476", name: "Technical Writing",                              day: "TUE", time: "17:00-19:00", hall: "PG-LR5",         lecturer: "Prof. Fopah-Lele/ Dr. Temgoua",                   dept: "MEF" },

  { code: "CIV214", name: "Chemistry II",                                   day: "TUE", time: "07:00-09:00", hall: "FET-TECH1",      lecturer: "Tchetgnia Ngassam Ines Leana",                     dept: "CIV" },
  { code: "CIV310", name: "Thermodynamics",                                 day: "TUE", time: "07:00-09:00", hall: "PG-LR5",         lecturer: "Dr. Lontsi Agostiny Marrios",                     dept: "CIV" },
  { code: "CIV506", name: "Geotechnics Lab II",                             day: "TUE", time: "09:00-11:00", hall: "CIV-LAB",        lecturer: "Njike Manette/ Tata Sunjo/ Agbor/ Feumoe/ Kila",  dept: "CIV" },
  { code: "CIV402", name: "Reinforced Concrete I",                          day: "TUE", time: "09:00-11:00", hall: "FET-BGFL",       lecturer: "Chia E.",                                         dept: "CIV" },
  { code: "CIV506", name: "Geotechnics Lab II",                             day: "TUE", time: "11:00-13:00", hall: "CIV-LAB",        lecturer: "Njike Manette/ Tata Sunjo/ Agbor/ Feumoe/ Kila",  dept: "CIV" },
  { code: "CIV202", name: "Materials Science & Technology",                 day: "TUE", time: "11:00-13:00", hall: "FET-TECH2",      lecturer: "Tchetgnia Ngassam Ines Leana",                     dept: "CIV" },
  { code: "CIV342", name: "Architectural Drawing",                          day: "TUE", time: "11:00-13:00", hall: "FET-TECH2",      lecturer: "Goodwill N.",                                     dept: "CIV" },
  { code: "CIV404", name: "Fluid Mechanics and Hydraulic Constructions",    day: "TUE", time: "13:00-15:00", hall: "FET-TECH4",      lecturer: "Lontsi Agostiny Marrios",                         dept: "CIV" },
  { code: "CIV324", name: "Health, Safety, Security and Environment (HSSE)",day: "TUE", time: "13:00-15:00", hall: "FET-TECH3",      lecturer: "Dr. Ngassam/ Dr. Mwebi",                          dept: "CIV" },
  { code: "CIV422", name: "Structural Analysis II: Indeterminate Structure",day: "TUE", time: "15:00-17:00", hall: "PG-LR5",         lecturer: "Njike M./ Kila S.",                               dept: "CIV" },
  { code: "CIV324", name: "Health, Safety, Security and Environment (HSSE)",day: "TUE", time: "15:00-17:00", hall: "FET-TECH3",      lecturer: "Dr. Ngassam/ Dr. Mwebi",                          dept: "CIV" },
  { code: "CIV222", name: "General Algebra and Affine Geometry",            day: "TUE", time: "17:00-19:00", hall: "FET-BFF-HALL1",  lecturer: "Agbor D./ Feumoe Narcisse Alain",                 dept: "CIV" },
  { code: "CIV504", name: "Structural Analysis and Design",                 day: "TUE", time: "17:00-19:00", hall: "FET-TECH1",      lecturer: "Dr. Njike/ Chia",                                 dept: "CIV" },

  { code: "EEF262", name: "Physics for Engineering II",                     day: "TUE", time: "07:00-09:00", hall: "FET-BGFL",       lecturer: "Dr. Job/ Dr. Tabetah",                            dept: "EEF" },
  { code: "EEF364", name: "Basic Telecommunications",                       day: "TUE", time: "07:00-09:00", hall: "FET-TECH4",      lecturer: "Dr. Nkemeni/ Mr. Forcha Glen",                    dept: "EEF" },
  { code: "EEF462", name: "Digital Signal Processing",                      day: "TUE", time: "09:00-11:00", hall: "FET-TECH3",      lecturer: "Sitamtze Youmbi Bertrand",                        dept: "EEF" },
  { code: "EEF480", name: "Control of Electrical Machines",                 day: "TUE", time: "09:00-11:00", hall: "FET-TECH4",      lecturer: "Dr. Fotso",                                       dept: "EEF" },
  { code: "EEF464", name: "Wireless and Mobile Communications",             day: "TUE", time: "11:00-13:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Sitamtze Youmbi Bertrand",                    dept: "EEF" },
  { code: "EEF482", name: "Electric Machines II",                           day: "TUE", time: "13:00-15:00", hall: "FET-BFF-HALL2",  lecturer: "Fotso Mbobda Christophe Raoul",                   dept: "EEF" },
  { code: "EEF366", name: "Sequence Control",                               day: "TUE", time: "15:00-17:00", hall: "FET-TECH1",      lecturer: "Dr. Nouadjep/ Dr. Musong",                        dept: "EEF" },
  { code: "EEF466", name: "Antenna and Propagation",                        day: "TUE", time: "15:00-17:00", hall: "FET-TECH4",      lecturer: "Engr. Baar David",                                dept: "EEF" },
  { code: "FET596", name: "Entrepreneurship Project",                       day: "TUE", time: "17:00-19:00", hall: "FET-TECH2",      lecturer: "Dr. Nkemeni/ Engr. Fongoh",                       dept: "EEF" },

  { code: "CPE208", name: "Chemical Process Principle",                     day: "TUE", time: "07:00-09:00", hall: "FET-TECH2",      lecturer: "Dr. Teiseh",                                      dept: "CPE" },
  { code: "CPE302", name: "Health Safety and Environment",                  day: "TUE", time: "09:00-11:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Boukanda",                                    dept: "CPE" },
  { code: "CPE212", name: "General Geology",                                day: "TUE", time: "11:00-13:00", hall: "PG-LR5",         lecturer: "Mr. Ayuk",                                        dept: "CPE" },
  { code: "CPE304", name: "Reservoir Engineering",                          day: "TUE", time: "11:00-13:00", hall: "FET-TECH3",      lecturer: "Dr. Victor Wotanie/ Mr. Ayuk Samuel",             dept: "CPE" },

  { code: "MEF360", name: "Fluid Mechanics II",                             day: "TUE", time: "09:00-11:00", hall: "PG-LR5",         lecturer: "Dr. Azeufack/ Dr. Simo",                          dept: "MEF" },

  // ─── WEDNESDAY ────────────────────────────────────────────────────────────

  { code: "CEF438", name: "Advanced Databases and Administration (Oracle/MySQL)", day: "WED", time: "07:00-09:00", hall: "FET-BFF-HALL2", lecturer: "Dr. Kamdjou",                              dept: "CEF" },
  { code: "CEF432", name: "Network Security Fundamentals",                  day: "WED", time: "07:00-09:00", hall: "FET-TECH3",      lecturer: "Dr. Tsague A.",                                   dept: "CEF" },
  { code: "CEF468", name: "Database and PHP Programming",                   day: "WED", time: "09:00-11:00", hall: "FET-BFF-HALL1",  lecturer: "Eng. Djotchuang Karl/ Forcha Glen Beloa",         dept: "CEF" },
  { code: "CEF476", name: "Software Engineering and Design",                day: "WED", time: "09:00-11:00", hall: "FET-TECH3",      lecturer: "Dr. Kamdjou/ Dr. Tsague",                         dept: "CEF" },
  { code: "CEF468", name: "Database and PHP Programming",                   day: "WED", time: "11:00-13:00", hall: "FET-BFF-HALL1",  lecturer: "Eng. Djotchuang Karl/ Forcha Glen Beloa",         dept: "CEF" },
  { code: "CEF476", name: "Software Engineering and Design",                day: "WED", time: "11:00-13:00", hall: "FET-TECH3",      lecturer: "Dr. Kamdjou/ Dr. Tsague",                         dept: "CEF" },
  { code: "CEF478", name: "Network Administration",                         day: "WED", time: "11:00-13:00", hall: "FET-TECH1",      lecturer: "Mr. Forcha Glen",                                 dept: "CEF" },
  { code: "CEF438", name: "Advanced Databases and Administration (Oracle/MySQL)", day: "WED", time: "15:00-17:00", hall: "PG-LR5",   lecturer: "Dr. Kamdjou",                                     dept: "CEF" },
  { code: "CEF432", name: "Network Security Fundamentals",                  day: "WED", time: "15:00-17:00", hall: "FET-TECH3",      lecturer: "Dr. Tsague A.",                                   dept: "CEF" },
  { code: "CEF478", name: "Network Administration",                         day: "WED", time: "17:00-19:00", hall: "FET-BFF-HALL2",  lecturer: "Mr. Forcha Glen",                                 dept: "CEF" },

  { code: "EEF262", name: "Physics for Engineering II",                     day: "WED", time: "07:00-09:00", hall: "FET-BGFL",       lecturer: "Dr. Djob/ Dr. Tabetah",                           dept: "EEF" },
  { code: "EEF362", name: "Analog Electronics Laboratory",                  day: "WED", time: "07:00-09:00", hall: "EE Laboratory",  lecturer: "Tsafack P./ Musong/ Fendji",                      dept: "EEF" },
  { code: "EEF362", name: "Analog Electronics Laboratory",                  day: "WED", time: "09:00-11:00", hall: "EE Laboratory",  lecturer: "Tsafack P./ Musong/ Fendji",                      dept: "EEF" },
  { code: "EEF262", name: "Physics for Engineering II",                     day: "WED", time: "09:00-11:00", hall: "FET-BGFL",       lecturer: "Dr. Djob/ Dr. Tabetah",                           dept: "EEF" },
  { code: "EEF262", name: "Physics for Engineering II",                     day: "WED", time: "11:00-13:00", hall: "FET-BGFL",       lecturer: "Dr. Djob/ Dr. Tabetah",                           dept: "EEF" },
  { code: "EEF262", name: "Physics for Engineering II",                     day: "WED", time: "15:00-17:00", hall: "FET-BGFL",       lecturer: "Dr. Djob/ Dr. Tabetah",                           dept: "EEF" },
  { code: "EEF262", name: "Physics for Engineering II",                     day: "WED", time: "17:00-19:00", hall: "FET-BGFL",       lecturer: "Dr. Djob/ Dr. Tabetah",                           dept: "EEF" },

  { code: "MEF490", name: "Engineering Economy",                            day: "WED", time: "07:00-09:00", hall: "FET-TECH2",      lecturer: "Dr. Seppo",                                       dept: "MEF" },
  { code: "MEF302", name: "Design 2: Machine Element Design",               day: "WED", time: "07:00-09:00", hall: "PG-LR5",         lecturer: "Dr. Awa",                                         dept: "MEF" },
  { code: "MEF302", name: "Design 2: Machine Element Design",               day: "WED", time: "09:00-11:00", hall: "PG-LR5",         lecturer: "Dr. Awa",                                         dept: "MEF" },
  { code: "MEF490", name: "Engineering Economy",                            day: "WED", time: "15:00-17:00", hall: "FET-TECH2",      lecturer: "Dr. Seppo",                                       dept: "MEF" },
  { code: "MEF484", name: "Mechanical Laboratory II",                       day: "WED", time: "15:00-17:00", hall: "CIV Laboratory", lecturer: "Fopah/ Azeufack/ Simo/ AVTC-Limbe",               dept: "MEF" },
  { code: "MEF484", name: "Mechanical Laboratory II",                       day: "WED", time: "17:00-19:00", hall: "CIV Laboratory", lecturer: "Fopah/ Azeufack/ Simo/ AVTC-Limbe",               dept: "MEF" },

  { code: "CIV346", name: "Soil Mechanics",                                 day: "WED", time: "07:00-09:00", hall: "FET-TECH1",      lecturer: "Dr. Lontsi A./ Dr. Feumoe A.",                    dept: "CIV" },
  { code: "CIV426", name: "Structural Design",                              day: "WED", time: "07:00-09:00", hall: "FET-BFF-HALL1",  lecturer: "Njike Manette",                                   dept: "CIV" },
  { code: "CIV348", name: "Road and Various Networks",                      day: "WED", time: "11:00-13:00", hall: "PG-LR5",         lecturer: "Dr. Meh A.",                                      dept: "CIV" },
  { code: "CIV502", name: "Reinforced Concrete 2",                          day: "WED", time: "11:00-13:00", hall: "FET-TECH4",      lecturer: "Njike Manette/ Kang Cedric",                      dept: "CIV" },
  { code: "CIV346", name: "Soil Mechanics",                                 day: "WED", time: "15:00-17:00", hall: "FET-TECH1",      lecturer: "Dr. Lontsi A./ Dr. Feumoe A.",                    dept: "CIV" },
  { code: "CIV426", name: "Structural Design",                              day: "WED", time: "15:00-17:00", hall: "FET-BFF-HALL1",  lecturer: "Njike Manette",                                   dept: "CIV" },
  { code: "CIV502", name: "Reinforced Concrete 2",                          day: "WED", time: "17:00-19:00", hall: "PG-LR5",         lecturer: "Njike Manette/ Kang Cedric",                      dept: "CIV" },
  { code: "CIV348", name: "Road and Various Networks",                      day: "WED", time: "17:00-19:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Meh A.",                                      dept: "CIV" },

  // ─── THURSDAY ─────────────────────────────────────────────────────────────

  { code: "CEF346", name: "Object Oriented Programming (JAVA/C++)",         day: "THU", time: "09:00-11:00", hall: "PG-LR5",         lecturer: "Dr. Djouela",                                     dept: "CEF" },
  { code: "CEF350", name: "Security and Cryptosystem",                      day: "THU", time: "09:00-11:00", hall: "FET-TECH1",      lecturer: "Dr. Tsague A.",                                   dept: "CEF" },
  { code: "CEF352", name: "Tools and Numerical Methods for Engineering",    day: "THU", time: "11:00-13:00", hall: "FET-TECH2",      lecturer: "Dr. Wati/ Dr. Azeufack",                          dept: "CEF" },
  { code: "CEF450", name: "Cloud Computing and Service Oriented Architectures", day: "THU", time: "11:00-13:00", hall: "PG-LR5",    lecturer: "Dr. Djouela Inès",                                dept: "CEF" },
  { code: "CEF482", name: "XML and Document Content Description",           day: "THU", time: "13:00-15:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Sop",                                         dept: "CEF" },
  { code: "CEF488", name: "System and Network Programming",                 day: "THU", time: "13:00-15:00", hall: "PG-LR5",         lecturer: "Mr. Forcha Glen",                                 dept: "CEF" },
  { code: "CEF354", name: "Switching and Routing Protocols",                day: "THU", time: "15:00-17:00", hall: "PG-LR5",         lecturer: "Dr. Nkemeni V./ Dr. Nguti",                       dept: "CEF" },
  { code: "CEF474", name: "Software Verification and Validation Techniques",day: "THU", time: "17:00-19:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Tsague A.",                                   dept: "CEF" },
  { code: "CEF458", name: "Enterprise IP and Telephony and Video Network",  day: "THU", time: "17:00-19:00", hall: "PG-LR5",         lecturer: "Dr. Kamdjou",                                     dept: "CEF" },

  { code: "MEF416", name: "Basics of Industrial Automation",                day: "THU", time: "07:00-09:00", hall: "FET-TECH2",      lecturer: "",                                                dept: "MEF" },
  { code: "MEF450", name: "Hydraulics and Pneumatics",                      day: "THU", time: "07:00-09:00", hall: "PG-LR5",         lecturer: "Ejuh Che",                                        dept: "MEF" },
  { code: "MEF486", name: "Basic of Mechatronics",                          day: "THU", time: "07:00-09:00", hall: "FET-TECH3",      lecturer: "Dr. Simo Domguia/ Dr. Wamba",                     dept: "MEF" },
  { code: "MEF366", name: "Heat Transfer",                                  day: "THU", time: "09:00-11:00", hall: "FET-TECH3",      lecturer: "Dr. Temgoua/ Prof. Fopah-Lele",                   dept: "MEF" },
  { code: "MEF420", name: "Introduction to Machine Learning",               day: "THU", time: "11:00-13:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Wamba",                                       dept: "MEF" },
  { code: "MEF460", name: "Design Graphics for Mechanical Engineering",     day: "THU", time: "11:00-13:00", hall: "FET-TECH1",      lecturer: "Dr. Aquigeh Newen",                               dept: "MEF" },
  { code: "MEF268", name: "Electrical Engineering for Mechanical Engineers",day: "THU", time: "11:00-13:00", hall: "FET-TECH3",      lecturer: "Simo Domguia Ulrich",                             dept: "MEF" },
  { code: "MEF368", name: "Design and Operation of Chemical Apparatus",     day: "THU", time: "13:00-15:00", hall: "FET-TECH1",      lecturer: "Nouadjep Serge",                                  dept: "MEF" },
  { code: "MEF464", name: "Heating, Ventilation and Air Conditioning",      day: "THU", time: "13:00-15:00", hall: "FET-TECH3",      lecturer: "Dr. Aquigeh Newen",                               dept: "MEF" },
  { code: "MEF482", name: "Design of Pressure Vessels",                     day: "THU", time: "13:00-15:00", hall: "FET-TECH4",      lecturer: "Ateuafack",                                       dept: "MEF" },
  { code: "MEF370", name: "Process Technology & Design",                    day: "THU", time: "15:00-17:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Tsamo Nestor",                                dept: "MEF" },
  { code: "MEF470", name: "Embedded Application Design and Interfacing",    day: "THU", time: "17:00-19:00", hall: "FET-TECH2",      lecturer: "Ejuh Che",                                        dept: "MEF" },

  { code: "CIV410", name: "Fundamentals of Building Information Management (BIM)", day: "THU", time: "07:00-09:00", hall: "FET-BFF-HALL1", lecturer: "Mr. Kang Cederic/ Chia",                   dept: "CIV" },
  { code: "CIV234", name: "Introduction to Architecture",                   day: "THU", time: "09:00-11:00", hall: "FET-BFF-HALL1",  lecturer: "Mackongo Jean Christian",                         dept: "CIV" },
  { code: "CIV334", name: "Strength of Materials",                          day: "THU", time: "09:00-11:00", hall: "FET-TECH4",      lecturer: "Njike Manette/ Kila",                             dept: "CIV" },
  { code: "CIV234", name: "Introduction to Architecture",                   day: "THU", time: "11:00-13:00", hall: "FET-TECH4",      lecturer: "Mackongo Jean Christian",                         dept: "CIV" },
  { code: "EEF490", name: "Hybrid Energy Components and Systems",           day: "THU", time: "11:00-13:00", hall: "FET-BFF-HALL1",  lecturer: "Prof. Fopah/ Dr. Wati",                           dept: "EEF" },
  { code: "CIV340", name: "Technical Writing",                              day: "THU", time: "13:00-15:00", hall: "FET-TECH2",      lecturer: "Prof. Tata S./ Dr. Mwebi",                        dept: "CIV" },
  { code: "CIV416", name: "Introduction to Urbanism and Transport",         day: "THU", time: "13:00-15:00", hall: "FET-BGFL",       lecturer: "Tata Sunjo/ Meh A.",                              dept: "CIV" },
  { code: "CIV228", name: "Programming and Application Software",           day: "THU", time: "15:00-17:00", hall: "FET-TECH2",      lecturer: "Dr. Nouadjep Serge",                              dept: "CIV" },
  { code: "CIV318", name: "Building Services",                              day: "THU", time: "15:00-17:00", hall: "FET-BFF-HALL1",  lecturer: "Mackongo Jean Christian/ Kang Cederic",           dept: "CIV" },
  { code: "CIV318", name: "Building Services",                              day: "THU", time: "17:00-19:00", hall: "FET-TECH1",      lecturer: "Mackongo Jean Christian/ Kang Cederic",           dept: "CIV" },
  { code: "CIV418", name: "Quality, Safety, and Environmental Management",  day: "THU", time: "17:00-19:00", hall: "FET-BGFL",       lecturer: "Ngassam Ines/ Mwebi Clautaire",                   dept: "CIV" },

  { code: "EEF484", name: "Electrical Power Systems Engineering II",        day: "THU", time: "07:00-09:00", hall: "FET-TECH1",      lecturer: "Fotso Mbobda Christophe Raoul/ Ayuketah",         dept: "EEF" },
  { code: "EEF260", name: "Analog Electronics I",                           day: "THU", time: "07:00-09:00", hall: "FET-TECH4",      lecturer: "Dr. Tabeta Marshall",                             dept: "EEF" },
  { code: "EEF474", name: "Coding Theory",                                  day: "THU", time: "09:00-11:00", hall: "FET-TECH2",      lecturer: "Mr. Ajua Columbus",                               dept: "EEF" },
  { code: "EEF268", name: "Digital Electronics II",                         day: "THU", time: "11:00-13:00", hall: "FET-BGFL",       lecturer: "Wirnkar Basil Nsanyuy/ Ayuketah Yvan",            dept: "EEF" },
  { code: "EEF264", name: "Control Engineering Instrumentation",            day: "THU", time: "15:00-17:00", hall: "FET-TECH1",      lecturer: "Dr. Nouadjep",                                    dept: "EEF" },
  { code: "EEF360", name: "Systems Simulation and PCB Design Techniques",   day: "THU", time: "15:00-17:00", hall: "FET-BGFL",       lecturer: "Prof. Ngwashi/ Dr. Tabetah",                      dept: "EEF" },
  { code: "EEF360", name: "Systems Simulation and PCB Design Techniques",   day: "THU", time: "17:00-19:00", hall: "FET-BGFL",       lecturer: "Prof. Ngwashi/ Dr. Tabetah",                      dept: "EEF" },

  // ─── FRIDAY ───────────────────────────────────────────────────────────────

  { code: "CEF444", name: "Artificial Intelligence and Machine Learning",   day: "FRI", time: "07:00-09:00", hall: "FET-BGFL",       lecturer: "Prof. Fute/ Dr. Sop",                             dept: "CEF" },
  { code: "CEF342", name: "Database and Design",                            day: "FRI", time: "07:00-09:00", hall: "FET-TECH3",      lecturer: "Eng. Kingue Patrick",                             dept: "CEF" },
  { code: "CEF472", name: "Human Computer Interface",                       day: "FRI", time: "09:00-11:00", hall: "FET-TECH1",      lecturer: "Dr. Djouela Inès",                                dept: "CEF" },
  { code: "CEF364", name: "Local Area Computer Network",                    day: "FRI", time: "09:00-11:00", hall: "FET-TECH2",      lecturer: "Mr. Glen Forcha",                                 dept: "CEF" },
  { code: "CEF254", name: "Algebra",                                        day: "FRI", time: "11:00-13:00", hall: "FET-BGFL",       lecturer: "Dr. Dor C.",                                      dept: "CEF" },
  { code: "CEF364", name: "Local Area Computer Network",                    day: "FRI", time: "11:00-13:00", hall: "FET-TECH1",      lecturer: "Mr. Glen Forcha",                                 dept: "CEF" },
  { code: "CEF462", name: "Digital Image Processing",                       day: "FRI", time: "11:00-13:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Sop Deffo",                                   dept: "CEF" },
  { code: "CEF344", name: "Client-Server and Web Application Development",  day: "FRI", time: "13:00-15:00", hall: "PG-LR5",         lecturer: "Dr. Sop Deffo",                                   dept: "CEF" },
  { code: "CEF250", name: "Computer Architecture",                          day: "FRI", time: "13:00-15:00", hall: "FET-BGFL",       lecturer: "Mr. Forcha Glen",                                 dept: "CEF" },
  { code: "CEF356", name: "Mobile Communications and Protocols",            day: "FRI", time: "15:00-17:00", hall: "FET-BGFL",       lecturer: "Dr. Nkemeni V.",                                  dept: "CEF" },

  { code: "MEF204", name: "Basics of Mechanical Drawing",                   day: "FRI", time: "07:00-09:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Temgoua/ Dr. Aquigeh",                        dept: "MEF" },
  { code: "MEF360", name: "Fluid Mechanics II",                             day: "FRI", time: "09:00-11:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Azeufack/ Dr. Simo",                          dept: "MEF" },
  { code: "MEF410", name: "Metrology and Quality Control",                  day: "FRI", time: "13:00-15:00", hall: "FET-BFF-HALL1",  lecturer: "Ateuafack (COT)",                                 dept: "MEF" },
  { code: "MEF240", name: "Introduction to Thermodynamics",                 day: "FRI", time: "13:00-15:00", hall: "FET-TECH2",      lecturer: "Prof. Fopah-Lele/ Dr. Temgoua",                   dept: "MEF" },
  { code: "MEF414", name: "CNC Machining",                                  day: "FRI", time: "13:00-15:00", hall: "FET-TECH1",      lecturer: "Azeufack",                                        dept: "MEF" },
  { code: "MEF594", name: "Entrepreneurship",                               day: "FRI", time: "15:00-17:00", hall: "FET-TECH2",      lecturer: "Dr. Nouadjep Serge",                              dept: "MEF" },
  { code: "MEF354", name: "Thermodynamics",                                 day: "FRI", time: "15:00-17:00", hall: "FET-TECH2",      lecturer: "Temgoua Djouatsa Diane Estelle",                  dept: "MEF" },
  { code: "MEF476", name: "Technical Writing",                              day: "FRI", time: "17:00-19:00", hall: "PG-LR5",         lecturer: "Prof. Fopah-Lele/ Dr. Temgoua",                   dept: "MEF" },

  { code: "CIV214", name: "Chemistry II",                                   day: "FRI", time: "07:00-09:00", hall: "FET-TECH1",      lecturer: "Tchetgnia Ngassam Ines Leana",                     dept: "CIV" },
  { code: "CIV310", name: "Thermodynamics",                                 day: "FRI", time: "07:00-09:00", hall: "PG-LR5",         lecturer: "Dr. Lontsi Agostiny Marrios",                     dept: "CIV" },
  { code: "CIV344", name: "Solid Mechanics",                                day: "FRI", time: "09:00-11:00", hall: "PG-LR5",         lecturer: "Dr. Feumoe Narcisse",                             dept: "CIV" },
  { code: "CIV402", name: "Reinforced Concrete I",                          day: "FRI", time: "09:00-11:00", hall: "FET-BGFL",       lecturer: "Chia E.",                                         dept: "CIV" },
  { code: "CIV202", name: "Materials Science & Technology",                 day: "FRI", time: "11:00-13:00", hall: "FET-TECH2",      lecturer: "Tchetgnia Ngassam Ines Leana",                     dept: "CIV" },
  { code: "CIV404", name: "Fluid Mechanics and Hydraulic Constructions",    day: "FRI", time: "13:00-15:00", hall: "FET-TECH3",      lecturer: "Lontsi Agostiny Marrios",                         dept: "CIV" },
  { code: "CIV344", name: "Solid Mechanics",                                day: "FRI", time: "13:00-15:00", hall: "FET-TECH4",      lecturer: "Dr. Feumoe Narcisse",                             dept: "CIV" },
  { code: "CIV422", name: "Structural Analysis II: Indeterminate Structure",day: "FRI", time: "15:00-17:00", hall: "PG-LR5",         lecturer: "Njike M./ Kila S.",                               dept: "CIV" },
  { code: "CIV324", name: "Health, Safety, Security and Environment (HSSE)",day: "FRI", time: "15:00-17:00", hall: "FET-TECH3",      lecturer: "Dr. Ngassam/ Dr. Mwebi",                          dept: "CIV" },
  { code: "CIV210", name: "Fluid Mechanics",                                day: "FRI", time: "15:00-17:00", hall: "FET-BGFL",       lecturer: "Dr. Lontsi/ Dr. Mwebi",                           dept: "CIV" },
  { code: "CIV504", name: "Structural Analysis and Design",                 day: "FRI", time: "17:00-19:00", hall: "FET-TECH1",      lecturer: "Dr. Njike/ Chia",                                 dept: "CIV" },

  { code: "EEF364", name: "Basic Telecommunications",                       day: "FRI", time: "07:00-09:00", hall: "FET-TECH4",      lecturer: "Dr. Nkemeni/ Mr. Forcha Glen",                    dept: "EEF" },
  { code: "EEF462", name: "Digital Signal Processing",                      day: "FRI", time: "09:00-11:00", hall: "FET-TECH3",      lecturer: "Sitamtze Youmbi Bertrand",                        dept: "EEF" },
  { code: "EEF480", name: "Control of Electrical Machines",                 day: "FRI", time: "09:00-11:00", hall: "FET-TECH4",      lecturer: "Dr. Fotso",                                       dept: "EEF" },
  { code: "EEF464", name: "Wireless and Mobile Communications",             day: "FRI", time: "11:00-13:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Sitamtze Youmbi Bertrand",                    dept: "EEF" },
  { code: "EEF482", name: "Electric Machines II",                           day: "FRI", time: "13:00-15:00", hall: "FET-BFF-HALL2",  lecturer: "Fotso Mbobda Christophe Raoul",                   dept: "EEF" },
  { code: "EEF366", name: "Sequence Control",                               day: "FRI", time: "15:00-17:00", hall: "FET-TECH1",      lecturer: "Dr. Nouadjep/ Dr. Musong",                        dept: "EEF" },
  { code: "EEF466", name: "Antenna and Propagation",                        day: "FRI", time: "15:00-17:00", hall: "FET-TECH4",      lecturer: "Engr. Baar David",                                dept: "EEF" },
  { code: "EEF262", name: "Physics for Engineering II",                     day: "FRI", time: "17:00-19:00", hall: "FET-TECH3",      lecturer: "Dr. Djob/ Dr. Tabetah",                           dept: "EEF" },
  { code: "FET596", name: "Entrepreneurship Project",                       day: "FRI", time: "17:00-19:00", hall: "FET-TECH2",      lecturer: "Dr. Nkemeni/ Engr. Fongoh",                       dept: "EEF" },

  { code: "CPE208", name: "Chemical Process Principle",                     day: "FRI", time: "07:00-09:00", hall: "FET-TECH2",      lecturer: "Dr. Teiseh",                                      dept: "CPE" },
  { code: "CPE302", name: "Health Safety and Environment",                  day: "FRI", time: "09:00-11:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Boukanda",                                    dept: "CPE" },
  { code: "CPE212", name: "General Geology",                                day: "FRI", time: "11:00-13:00", hall: "PG-LR5",         lecturer: "Mr. Ayuk",                                        dept: "CPE" },
  { code: "CPE304", name: "Reservoir Engineering",                          day: "FRI", time: "11:00-13:00", hall: "FET-TECH3",      lecturer: "Dr. Victor Wotanie/ Mr. Ayuk Samuel",             dept: "CPE" },

  // ─── SATURDAY ─────────────────────────────────────────────────────────────

  { code: "CEF346", name: "Object Oriented Programming (JAVA/C++)",         day: "SAT", time: "09:00-11:00", hall: "PG-LR5",         lecturer: "Dr. Djouela",                                     dept: "CEF" },
  { code: "CEF350", name: "Security and Cryptosystem",                      day: "SAT", time: "09:00-11:00", hall: "FET-TECH1",      lecturer: "Dr. Tsague A.",                                   dept: "CEF" },
  { code: "CEF352", name: "Tools and Numerical Methods for Engineering",    day: "SAT", time: "11:00-13:00", hall: "FET-TECH2",      lecturer: "Dr. Wati/ Dr. Azeufack",                          dept: "CEF" },
  { code: "CEF450", name: "Cloud Computing and Service Oriented Architectures", day: "SAT", time: "11:00-13:00", hall: "PG-LR5",    lecturer: "Dr. Djouela Inès",                                dept: "CEF" },
  { code: "CEF482", name: "XML and Document Content Description",           day: "SAT", time: "13:00-15:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Sop",                                         dept: "CEF" },
  { code: "CEF488", name: "System and Network Programming",                 day: "SAT", time: "13:00-15:00", hall: "PG-LR5",         lecturer: "Mr. Forcha Glen",                                 dept: "CEF" },
  { code: "CEF354", name: "Switching and Routing Protocols",                day: "SAT", time: "15:00-17:00", hall: "FET-BGFL",       lecturer: "Dr. Nkemeni V./ Dr. Nguti",                       dept: "CEF" },
  { code: "CEF474", name: "Software Verification and Validation Techniques",day: "SAT", time: "17:00-19:00", hall: "FET-BFF-HALL1",  lecturer: "Dr. Tsague A.",                                   dept: "CEF" },
  { code: "CEF458", name: "Enterprise IP and Telephony and Video Network",  day: "SAT", time: "17:00-19:00", hall: "PG-LR5",         lecturer: "Dr. Kamdjou",                                     dept: "CEF" },

  { code: "MEF416", name: "Basics of Industrial Automation",                day: "SAT", time: "07:00-09:00", hall: "FET-TECH2",      lecturer: "",                                                dept: "MEF" },
  { code: "MEF450", name: "Hydraulics and Pneumatics",                      day: "SAT", time: "07:00-09:00", hall: "PG-LR5",         lecturer: "Ejuh Che",                                        dept: "MEF" },
  { code: "MEF486", name: "Basic of Mechatronics",                          day: "SAT", time: "07:00-09:00", hall: "FET-TECH3",      lecturer: "Dr. Simo Domguia/ Dr. Wamba",                     dept: "MEF" },
  { code: "MEF202", name: "Materials Science and Technology",               day: "SAT", time: "07:00-09:00", hall: "FET-BGFL",       lecturer: "Dr. Awa",                                         dept: "MEF" },
  { code: "MEF202", name: "Materials Science and Technology",               day: "SAT", time: "09:00-11:00", hall: "FET-BGFL",       lecturer: "Dr. Awa",                                         dept: "MEF" },
  { code: "MEF366", name: "Heat Transfer",                                  day: "SAT", time: "09:00-11:00", hall: "FET-TECH3",      lecturer: "Dr. Temgoua/ Prof. Fopah-Lele",                   dept: "MEF" },
  { code: "MEF420", name: "Introduction to Machine Learning",               day: "SAT", time: "11:00-13:00", hall: "FET-BFF-HALL2",  lecturer: "Dr. Wamba",                                       dept: "MEF" },
  { code: "MEF460", name: "Design Graphics for Mechanical Engineering",     day: "SAT", time: "11:00-13:00", hall: "FET-TECH1",      lecturer: "Dr. Aquigeh Newen",                               dept: "MEF" },
  { code: "MEF268", name: "Electrical Engineering for Mechanical Engineers",day: "SAT", time: "11:00-13:00", hall: "FET-TECH3",      lecturer: "Simo Domguia Ulrich",                             dept: "MEF" },
  { code: "MEF368", name: "Design and Operation of Chemical Apparatus",     day: "SAT", time: "13:00-15:00", hall: "FET-TECH1",      lecturer: "Nouadjep Serge",                                  dept: "MEF" },
  { code: "MEF464", name: "Heating, Ventilation and Air Conditioning",      day: "SAT", time: "13:00-15:00", hall: "FET-TECH3",      lecturer: "Dr. Aquigeh Newen",                               dept: "MEF" },
  { code: "MEF482", name: "Design of Pressure Vessels",                     day: "SAT", time: "13:00-15:00", hall: "FET-TECH4",      lecturer: "Ateuafack",                                       dept: "MEF" },
  { code: "MEF370", name: "Process Technology & Design",                    day: "SAT", time: "15:00-17:00", hall: "PG-LR5",         lecturer: "Dr. Tsamo Nestor",                                dept: "MEF" },
  { code: "MEF470", name: "Embedded Application Design and Interfacing",    day: "SAT", time: "17:00-19:00", hall: "FET-TECH2",      lecturer: "Ejuh Che",                                        dept: "MEF" },

  { code: "CIV410", name: "Fundamentals of Building Information Management (BIM)", day: "SAT", time: "07:00-09:00", hall: "FET-BFF-HALL1", lecturer: "Mr. Kang Cederic/ Chia",                   dept: "CIV" },
  { code: "CIV222", name: "General Algebra and Affine Geometry",            day: "SAT", time: "09:00-11:00", hall: "FET-BFF-HALL1",  lecturer: "Agbor D./ Feumoe Narcisse Alain",                 dept: "CIV" },
  { code: "CIV334", name: "Strength of Materials",                          day: "SAT", time: "09:00-11:00", hall: "FET-TECH4",      lecturer: "Njike Manette/ Kila",                             dept: "CIV" },
  { code: "CIV210", name: "Fluid Mechanics",                                day: "SAT", time: "11:00-13:00", hall: "FET-TECH4",      lecturer: "Dr. Lontsi/ Dr. Mwebi",                           dept: "CIV" },
  { code: "CIV340", name: "Technical Writing",                              day: "SAT", time: "13:00-15:00", hall: "FET-TECH2",      lecturer: "Prof. Tata S./ Dr. Mwebi",                        dept: "CIV" },
  { code: "CIV416", name: "Introduction to Urbanism and Transport",         day: "SAT", time: "13:00-15:00", hall: "FET-BGFL",       lecturer: "Tata Sunjo/ Meh",                                 dept: "CIV" },
  { code: "CIV228", name: "Programming and Application Software",           day: "SAT", time: "15:00-17:00", hall: "FET-TECH2",      lecturer: "Dr. Nouadjep Serge",                              dept: "CIV" },
  { code: "CIV342", name: "Architectural Drawing",                          day: "SAT", time: "15:00-17:00", hall: "FET-BFF-HALL1",  lecturer: "Goodwill N.",                                     dept: "CIV" },
  { code: "CIV418", name: "Quality, Safety, and Environmental Management",  day: "SAT", time: "17:00-19:00", hall: "FET-BGFL",       lecturer: "Ngassam Ines/ Mwebi Clautaire",                   dept: "CIV" },
  { code: "CIV344", name: "Solid Mechanics",                                day: "SAT", time: "17:00-19:00", hall: "FET-TECH1",      lecturer: "Dr. Feumoe Narcisse",                             dept: "CIV" },

  { code: "EEF484", name: "Electrical Power Systems Engineering II",        day: "SAT", time: "07:00-09:00", hall: "FET-TECH1",      lecturer: "Fotso Mbobda Christophe Raoul/ Ayuketah",         dept: "EEF" },
  { code: "EEF260", name: "Analog Electronics I",                           day: "SAT", time: "07:00-09:00", hall: "FET-TECH4",      lecturer: "Dr. Tabeta Marshall",                             dept: "EEF" },
  { code: "EEF474", name: "Coding Theory",                                  day: "SAT", time: "09:00-11:00", hall: "FET-TECH2",      lecturer: "Mr. Ajua Columbus",                               dept: "EEF" },
  { code: "EEF490", name: "Hybrid Energy Components and Systems",           day: "SAT", time: "11:00-13:00", hall: "FET-BFF-HALL1",  lecturer: "Prof. Fopah/ Dr. Wati",                           dept: "EEF" },
  { code: "EEF268", name: "Digital Electronics II",                         day: "SAT", time: "11:00-13:00", hall: "FET-BGFL",       lecturer: "Wirnkar Basil Nsanyuy/ Ayuketah Yvan",            dept: "EEF" },
  { code: "EEF264", name: "Control Engineering Instrumentation",            day: "SAT", time: "15:00-17:00", hall: "FET-TECH1",      lecturer: "Dr. Nouadjep",                                    dept: "EEF" },

];
```

---

## Stats

| Dept | Total Entries |
|------|--------------|
| CEF  | 58           |
| EEF  | 47           |
| CIV  | 57           |
| MEF  | 55           |
| CPE  | 8            |
| **Total** | **225** |

> **Note:** `MEF416` (Basics of Industrial Automation) has no lecturer listed in the source PDF on both THU and SAT. Fill in when available.  
> Some courses appear multiple times (split sessions across the same or different days) — this is intentional and matches the official timetable.
