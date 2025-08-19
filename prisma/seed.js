const prisma = require('./prismaClient');
const scrapeMicrosoftCerts = require('../scrapeMicrosoftCerts');

async function main() {

// 🧹 Clear existing data first
  console.log("🧹 Clearing existing database records...");
  await prisma.order.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.vendor.deleteMany();
  console.log("✅ Database cleared.\n");

  // 1️⃣ Vendors to seed
  const vendorNames = [
    "Cisco",
    "CompTIA",
    "AWS",
    "Microsoft",
    "ISC²",
    "PMI",
    "EC-Council",
    "Axelos",
    "Google",
    "Oracle",
    "Palo Alto Networks",
  ];

  console.log("📦 Seeding ");

  // Find or create vendors and store their IDs
  const vendorMap = {};
  for (const name of vendorNames) {
    let vendor = await prisma.vendor.findUnique({ where: { name } });
    if (!vendor) {
      vendor = await prisma.vendor.create({ data: { name } });
    }
    vendorMap[name] = vendor.id;
    console.log(`✅ Vendor seeded: ${name} (id: ${vendor.id})`);
  }

  // 2️⃣ Scrape Microsoft certs dynamically
  console.log("🔍 Scraping Microsoft certifications...");
  const microsoftVouchers = await scrapeMicrosoftCerts();
  console.log(`🔍 Found ${microsoftVouchers.length} Microsoft certs.`);

  // 2️⃣ Vouchers to seed with vendorId
  const vouchers = [
    // Cisco
    { name: "CCNA", vendor: "Cisco", price: 300.0, description: "Cisco Certified Network Associate" },
    { name: "CCNP", vendor: "Cisco", price: 400.0, description: "Cisco Certified Network Professional(Core)" },
    { name: "CCIE", vendor: "Cisco", price: 450.0, description: "Cisco Certified Internetwork Expert" },
    { name: "Sales", vendor: "Cisco", price: 80.0, description: "Sales Readiness" },
    { name: "CCT", vendor: "Cisco", price: 200.0, description: "Cisco Certified Field Technician" },
    { name: "DevNet Associate", vendor: "Cisco", price: 300.0, description: "Cisco DevNet Associate" },
    { name: "CyberOps Associate", vendor: "Cisco", price: 300.0, description: "Cisco Certified CyberOps Associate" },
    { name: "Business Specialist Associate", vendor: "Cisco", price: 250.0, description: "Business Specialist Written Level 2 exams" },
    // CompTIA
{ name: "A+", vendor: "CompTIA", price: 133.0, description: "CompTIA A+ Certification" },
{ name: "A+ Network", vendor: "CompTIA", price: 195.0, description: "CompTIA Network+ Certification" },
{ name: "A+ Cyber", vendor: "CompTIA", price: 499.0, description: "CompTIA Security+ Certification" },
{ name: "Security+", vendor: "CompTIA", price: 214.0, description: "CompTIA Security+ Certification" },
{ name: "CySA+", vendor: "CompTIA", price: 213.0, description: "CompTIA Cybersecurity Analyst" },
{ name: "PenTest+", vendor: "CompTIA", price: 213.0, description: "CompTIA Penetration Tester" },
{ name: "CASP+", vendor: "CompTIA", price: 265.0, description: "CompTIA Advanced Security Practitioner" },
{ name: "Linux+", vendor: "CompTIA", price: 195.0, description: "CompTIA Linux+ Certification" },
{ name: "Cloud+", vendor: "CompTIA", price: 195.0, description: "CompTIA Cloud+ Certification" },
{ name: "Data+", vendor: "CompTIA", price: 128.0, description: "CompTIA Data+ Certification" },
{ name: "DataSystem+", vendor: "CompTIA", price: 195.0, description: "CompTIA DataSystem+ Certification" },
{name: "Tech+", vendor: "CompTIA", price: 63.0, description: "CompTIA Tech+ Certification" },
// Extended CompTIA/Misc Exams
{ name: "AI Essentials", vendor: "CompTIA", price: 99.0, description: "CompTIA AI Essentials Certification" },
{ name: "Business Essentials", vendor: "CompTIA", price: 99.0, description: "CompTIA Business Essentials Certification" },
{ name: "Cisco Network Pro V8", vendor: "CompTIA", price: 245.0, description: "CompTIA Cisco Network Pro Certification" },
{ name: "Windows Client Pro", vendor: "CompTIA", price: 230.0, description: "CompTIA Windows Client Pro Certification" },
{ name: "Cloud Essentials", vendor: "CompTIA", price: 99.0, description: "CompTIA Cloud Essentials Certification" },
{ name: "Cloud Essentials+", vendor: "CompTIA", price: 63.0, description: "CompTIA Cloud Essentials+ Certification" },
{ name: "CloudNetX", vendor: "CompTIA", price: 578.0, description: "CompTIA CloudNetX Certification" },
{ name: "Cyber Defense Pro", vendor: "CompTIA", price: 275.0, description: "CompTIA Cyber Defense Pro Certification" },
{ name: "Cyber+", vendor: "CompTIA", price: 290.0, description: "CompTIA Cyber+ Certification" },
{ name: "SecurityX", vendor: "CompTIA", price: 265.0, description: "CompTIA SecurityX Certification" },
{ name: "Soft Skill Essentials", vendor: "CompTIA", price: 99.0, description: "CompTIA Soft Skills Essentials" },
{ name: "Project+", vendor: "CompTIA", price: 195.0, description: "CompTIA Project+ Certification" },
{ name: "Security Pro", vendor: "CompTIA", price: 235.0, description: "CompTIA Security Pro Certification" },
{ name: "Microsoft Excel Pro", vendor: "CompTIA", price: 99.0, description: "CompTIA Microsoft Excel Pro Certification" },
{ name: "Microsoft Word Pro", vendor: "CompTIA", price: 99.0, description: "CompTIA Microsoft Word Pro Certification" },
{ name: "Linux Pro", vendor: "CompTIA", price: 275.0, description: "CompTIA Linux Pro Certification" },
{ name: "ITF+", vendor: "CompTIA", price: 63.0, description: "CompTIA IT Fundamentals (ITF+)" },
{ name: "IT Fundamentals Pro", vendor: "CompTIA", price: 105.0, description: "CompTIA IT Fundamentals Pro" },
{ name: "Ethical Hacker Pro", vendor: "CompTIA", price: 305.0, description: "CompTIA Ethical Hacker Pro Certification" },
{ name: "Digital Literacy Pro", vendor: "CompTIA", price: 99.0, description: "CompTIA Digital Literacy Pro Certification" },
{ name: "Hybrid Server Pro I:Core", vendor: "CompTIA", price: 230.0, description: "CompTIA Hybrid Server Pro I: Core" },
{ name: "Hybrid Server Pro II:Advanced", vendor: "CompTIA", price: 230.0, description: "CompTIA Hybrid Server Pro II: Core" },
{ name: "Library Suite", vendor: "CompTIA", price: 400.0, description: "CompTIA Library Suite" },
{ name: "PC Pro", vendor: "CompTIA", price: 230.0, description: "CompTIA PC Pro Certification" },
{ name: "Project Management Essentials", vendor: "CompTIA", price: 220.0, description: "CompTIA Project Management Essentials" },
{ name: "DataX", vendor: "CompTIA", price: 265.0, description: "CompTIA Data Scientist" },
{ name: "Network+", vendor: "CompTIA", price: 195.0, description: "CompTIA Network+ Certification" },
{ name: "Microsoft Office Pro", vendor: "CompTIA", price: 169.0, description: "CompTIA Microsoft Office Pro Certification" },
{ name: "Server+", vendor: "CompTIA", price: 195.0, description: "CompTIA Server+ Certification" },
    // AWS
    { name: 'AWS Certified Cloud Practitioner', vendor: 'AWS', price: 100, description: 'Showcase foundational knowledge of AWS cloud services and cloud computing' },
    { name: 'AWS Certified AI Practitioner', vendor: 'AWS', price: 100, description: 'Unlock new career possibilities with this AI certification' },
    { name: 'AWS Certified Machine Learning Engineer - Associate', vendor: 'AWS', price: 150, description: 'Position yourself for in-demand technical ML roles' },
    { name: 'AWS Certified Solutions Architect - Associate', vendor: 'AWS', price: 150, description: 'Validate your technical knowledge and skills across the breadth of AWS services' },
    { name: 'AWS Certified Developer - Associate', vendor: 'AWS', price: 150, description: 'Validate technical proficiency in developing, testing, deploying, and debugging AWS Cloud-based applications' },
    { name: 'AWS Certified SysOps Administrator - Associate', vendor: 'AWS', price: 150, description: 'Validate technical ability to deploy, manage, and operate workloads on AWS' },
    { name: 'AWS Certified Data Engineer - Associate', vendor: 'AWS', price: 150, description: 'Showcase your ability to design data models, manage data life cycles, and ensure data quality' },
    { name: 'AWS Certified DevOps Engineer - Professional', vendor: 'AWS', price: 300, description: 'Showcase advanced skills in bridging software development and cloud operations' },
    { name: 'AWS Certified Solutions Architect - Professional', vendor: 'AWS', price: 300, description: 'Showcase advanced skills in designing optimized AWS Cloud solutions' },
    { name: 'AWS Certified Machine Learning - Specialty', vendor: 'AWS', price: 300, description: 'Validate your knowledge and skills in building, training, and deploying machine learning models on AWS' },
    { name: 'AWS Certified Advanced Networking - Specialty', vendor: 'AWS', price: 300, description: 'Validate your knowledge and skills to handle critical and complex networking' },
    { name: 'AWS Certified Security - Specialty', vendor: 'AWS', price: 300, description: 'Validate your knowledge and advanced technical skills in securing workloads and architectures on AWS' },
       // Microsoft
{ name: "GitHub Actions", vendor: "Microsoft", price: 50.0, description: "GitHub Administrator - Intermediate" },
{ name: "GitHub Administration (beta)", vendor: "Microsoft", price: 50.0, description: "GitHub Administrator - Intermediate" },
{ name: "GitHub Advanced Security", vendor: "Microsoft", price: 50.0, description: "GitHub Administrator - Intermediate" },
{ name: "GitHub Copilot", vendor: "Microsoft", price: 50.0, description: "GitHub App Maker - Intermediate" },
{ name: "GitHub Foundations", vendor: "Microsoft", price: 50.0, description: "GitHub Administrator - Beginner" },
{ name: "Microsoft 365 Certified: Administrator Expert", vendor: "Microsoft", price: 83.0, description: "Exam MS-102 - Microsoft 365 Administrator - Advanced" },
{ name: "Microsoft 365 Certified: Collaboration Communications Systems Engineer Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft 365 Administrator - Intermediate" },
{ name: "Microsoft 365 Certified: Endpoint Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft 365 Administrator - Intermediate" },
{ name: "Microsoft 365 Certified: Fundamentals", vendor: "Microsoft", price: 50.0, description: "Office 365 Administrator - Beginner" },
{ name: "Microsoft 365 Certified: Teams Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft 365 Administrator - Intermediate" },
{ name: "Microsoft Certified Educator", vendor: "Microsoft", price: 62.0, description: "Windows Business User - Intermediate" },
{ name: "Microsoft Certified: Azure AI Engineer Associate", vendor: "Microsoft", price: 83.0, description: "Azure AI Engineer - Intermediate" },
{ name: "Microsoft Certified: Azure AI Fundamentals", vendor: "Microsoft", price: 50.0, description: "Azure AI Engineer - Beginner" },
{ name: "Microsoft Certified: Azure Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Azure Administrator - Intermediate" },
{ name: "Microsoft Certified: Azure Cosmos DB Developer Specialty", vendor: "Microsoft", price: 83.0, description: "Azure Developer - Intermediate" },
{ name: "Microsoft Certified: Azure Data Fundamentals", vendor: "Microsoft", price: 50.0, description: "Azure Data Engineer - Beginner" },
{ name: "Microsoft Certified: Azure Data Scientist Associate", vendor: "Microsoft", price: 83.0, description: "Azure Data Scientist - Intermediate" },
{ name: "Microsoft Certified: Azure Database Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Azure Database Administrator - Intermediate" },
{ name: "Microsoft Certified: Azure Developer Associate", vendor: "Microsoft", price: 83.0, description: "Azure Developer - Intermediate" },
{ name: "Microsoft Certified: Azure Fundamentals", vendor: "Microsoft", price: 50.0, description: "Azure Administrator - Beginner" },
{ name: "Microsoft Certified: Azure Network Engineer Associate", vendor: "Microsoft", price: 83.0, description: "Azure Network Engineer - Intermediate" },
{ name: "Microsoft Certified: Azure Security Engineer Associate", vendor: "Microsoft", price: 83.0, description: "Azure Security Engineer - Intermediate" },
{ name: "Microsoft Certified: Azure Solutions Architect Expert", vendor: "Microsoft", price: 83.0, description: "Exam AZ-305 - Azure Solution Architect - Advanced" },
{ name: "Microsoft Certified: Azure Virtual Desktop Specialty", vendor: "Microsoft", price: 83.0, description: "Azure Administrator - Intermediate" },
{ name: "Microsoft Certified: Azure for SAP Workloads Specialty", vendor: "Microsoft", price: 83.0, description: "Azure Solution Architect - Intermediate" },
{ name: "Microsoft Certified: Cybersecurity Architect Expert", vendor: "Microsoft", price: 83.0, description: "Exam SC-100 - Microsoft Defender Administrator - Advanced" },
{ name: "Microsoft Certified: DevOps Engineer Expert", vendor: "Microsoft", price: 83.0, description: "Exam AZ-400 - Azure DevOps Engineer - Advanced" },
{ name: "Microsoft Certified: Dynamics 365 Business Central Developer Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics 365 Business Analyst - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Business Central Functional Consultant Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics 365 Functional Consultant - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Customer Experience Analyst Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics Business Analyst - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Customer Service Functional Consultant Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics 365 Functional Consultant - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Field Service Functional Consultant Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics 365 Functional Consultant - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Finance Functional Consultant Associate", vendor: "Microsoft", price: 165.0, description: "Dynamics 365 Functional Consultant - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Fundamentals (CRM)", vendor: "Microsoft", price: 99.0, description: "Dynamics 365 Business Owner - Beginner" },
{ name: "Microsoft Certified: Dynamics 365 Fundamentals (ERP)", vendor: "Microsoft", price: 99.0, description: "Dynamics 365 Business Owner - Beginner" },
{ name: "Microsoft Certified: Dynamics 365 Supply Chain Management Functional Consultant Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics 365 Functional Consultant - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365 Supply Chain Management Functional Consultant Expert", vendor: "Microsoft", price: 83.0, description: "Exam MB-335 - Dynamics 365 Functional Consultant - Advanced" },
{ name: "Microsoft Certified: Dynamics 365: Finance and Operations Apps Developer Associate", vendor: "Microsoft", price: 83.0, description: "Dynamics 365 Developer - Intermediate" },
{ name: "Microsoft Certified: Dynamics 365: Finance and Operations Apps Solution Architect Expert", vendor: "Microsoft", price: 83.0, description: "Exam MB-700 - Dynamics 365 Functional Consultant - Advanced" },
{ name: "Microsoft Certified: Fabric Analytics Engineer Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft Fabric Data Engineer - Intermediate" },
{ name: "Microsoft Certified: Fabric Data Engineer Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft Fabric Data Engineer - Intermediate" },
{ name: "Microsoft Certified: Identity and Access Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Azure Security Engineer - Intermediate" },
{ name: "Microsoft Certified: Information Security Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft 365 Administrator - Intermediate" },
{ name: "Microsoft Certified: Power Automate RPA Developer Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft Power Platform Developer - Intermediate" },
{ name: "Microsoft Certified: Power BI Data Analyst Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft Power Platform Data Analyst - Intermediate" },
{ name: "Microsoft Certified: Power Platform Developer Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft Power Platform Developer - Intermediate" },
{ name: "Microsoft Certified: Power Platform Functional Consultant Associate", vendor: "Microsoft", price: 83.0, description: "Microsoft Power Platform Functional Consultant - Intermediate" },
{ name: "Microsoft Certified: Power Platform Fundamentals", vendor: "Microsoft", price: 50.0, description: "Microsoft Power Platform App Maker - Beginner" },
{ name: "Microsoft Certified: Power Platform Solution Architect Expert", vendor: "Microsoft", price: 83.0, description: "Exam PL-600 - Dynamics 365 Developer - Advanced" },
{ name: "Microsoft Certified: Security Operations Analyst Associate", vendor: "Microsoft", price: 83.0, description: "Azure Security Operations Analyst - Intermediate" },
{ name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals", vendor: "Microsoft", price: 50.0, description: "Azure Security Engineer - Beginner" },
{ name: "Microsoft Certified: Windows Server Hybrid Administrator Associate", vendor: "Microsoft", price: 83.0, description: "Exam AZ-800, AZ-801 - Microsoft Entra Administrator - Intermediate" },
{ name: "Microsoft Office Specialist: 2016 Master", vendor: "Microsoft", price: 100.0, description: "Exam 77-726, 77-728, 77-729 - Office Business User - Advanced" },
{ name: "Microsoft Office Specialist: Access (Office 2016)", vendor: "Microsoft", price: 100.0, description: "Access Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Access Expert (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Access Business User - Advanced" },
{ name: "Microsoft Office Specialist: Associate (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "Exam MO-110 - PowerPoint Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Associate (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Exam MO-100, MO-200, MO-300 - Office Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Excel (Office 2016)", vendor: "Microsoft", price: 100.0, description: "Excel Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Excel Associate (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "Excel Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Excel Associate (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Excel Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Excel Expert (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "Excel Business User - Advanced" },
{ name: "Microsoft Office Specialist: Excel Expert (Office 2016)", vendor: "Microsoft", price: 100.0, description: "Excel Business User - Advanced" },
{ name: "Microsoft Office Specialist: Excel Expert (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Excel Business User - Advanced" },
{ name: "Microsoft Office Specialist: Expert (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "Exam MO-211 - Word Business User - Advanced" },
{ name: "Microsoft Office Specialist: Expert (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Exam MO-101, MO-201, MO-500 - Office Business User - Advanced" },
{ name: "Microsoft Office Specialist: Outlook (Office 2016)", vendor: "Microsoft", price: 100.0, description: "Outlook Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Outlook Associate (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Outlook Business User - Intermediate" },
{ name: "Microsoft Office Specialist: PowerPoint (Office 2016)", vendor: "Microsoft", price: 100.0, description: "PowerPoint Business User - Intermediate" },
{ name: "Microsoft Office Specialist: PowerPoint Associate (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "PowerPoint Business User - Intermediate" },
{ name: "Microsoft Office Specialist: PowerPoint Associate (Office 2019)", vendor: "Microsoft", price: 100.0, description: "PowerPoint Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Word (Office 2016)", vendor: "Microsoft", price: 100.0, description: "Word Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Word Associate (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "Word Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Word Associate (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Word Business User - Intermediate" },
{ name: "Microsoft Office Specialist: Word Expert (Microsoft 365 Apps)", vendor: "Microsoft", price: 100.0, description: "Word Business User - Advanced" },
{ name: "Microsoft Office Specialist: Word Expert (Office 2016)", vendor: "Microsoft", price: 100.0, description: "Word Business User - Advanced" },
{ name: "Microsoft Office Specialist: Word Expert (Office 2019)", vendor: "Microsoft", price: 100.0, description: "Word Business User - Advanced" },



    // ISC²
    { name: "CISSP", vendor: "ISC²", price: 699.0, description: "Certified Information Systems Security Professional" },
    { name: "SSCP", vendor: "ISC²", price: 250.0, description: "Systems Security Certified Practitioner" },
    { name: "CCSP", vendor: "ISC²", price: 599.0, description: "Certified Cloud Security Professional" },
    { name: "HCISPP", vendor: "ISC²", price: 599.0, description: "HealthCare Information Security and Privacy Practitioner" },

    // PMI
    { name: "PMP", vendor: "PMI", price: 555.0, description: "Project Management Professional" },
    { name: "CAPM", vendor: "PMI", price: 225.0, description: "Certified Associate in Project Management" },
    { name: "PMI-ACP", vendor: "PMI", price: 495.0, description: "PMI Agile Certified Practitioner" },
    { name: "PgMP", vendor: "PMI", price: 800.0, description: "Program Management Professional" },

    // EC-Council
    { name: "CEH", vendor: "EC-Council", price: 950.0, description: "Certified Ethical Hacker" },
    { name: "CHFI", vendor: "EC-Council", price: 600.0, description: "Computer Hacking Forensic Investigator" },
    { name: "ECSA", vendor: "EC-Council", price: 600.0, description: "EC-Council Certified Security Analyst" },
    { name: "CND", vendor: "EC-Council", price: 550.0, description: "Certified Network Defender" },
    { name: "LPT (Master)", vendor: "EC-Council", price: 899.0, description: "Licensed Penetration Tester" },

    // Axelos
    { name: "ITIL Foundation", vendor: "Axelos", price: 330.0, description: "ITIL Foundation Certification" },
    { name: "ITIL Managing Professional", vendor: "Axelos", price: 400.0, description: "ITIL 4 Managing Professional" },
    { name: "ITIL Strategic Leader", vendor: "Axelos", price: 400.0, description: "ITIL 4 Strategic Leader" },

    // Google
    { name: "Cloud Architect", vendor: "Google", price: 200.0, description: "Professional Cloud Architect" },
    { name: "Associate Cloud Engineer", vendor: "Google", price: 125.0, description: "Associate Cloud Engineer" },
    { name: "Professional Data Engineer", vendor: "Google", price: 200.0, description: "Professional Data Engineer" },
    { name: "Professional Cloud Developer", vendor: "Google", price: 200.0, description: "Professional Cloud Developer" },
    { name: "Professional Security Engineer", vendor: "Google", price: 200.0, description: "Professional Cloud Security Engineer" },

    // Oracle
    { name: "DBA", vendor: "Oracle", price: 245.0, description: "Oracle Certified Database Administrator" },
    { name: "Java SE Programmer", vendor: "Oracle", price: 245.0, description: "Oracle Certified Java SE Programmer" },
    { name: "Cloud Infrastructure Architect", vendor: "Oracle", price: 245.0, description: "Oracle Cloud Infrastructure Architect" },
    { name: "PL/SQL Developer", vendor: "Oracle", price: 245.0, description: "Oracle Certified PL/SQL Developer" },
    { name: "MySQL DBA", vendor: "Oracle", price: 245.0, description: "Oracle MySQL Database Administrator" },

    // Palo Alto Networks
    { name: "Cybersecurity Apprentice", vendor: "Palo Alto Networks", price: 150.0, description: "Cyber Security Apprentice Exam" },
    { name: "Cybersecurity Practitioner", vendor: "Palo Alto Networks", price: 150.0, description: "Cybersecurity Practitioner Exam Voucher" },
    { name: "Network Security Professional", vendor: "Palo Alto Networks", price: 200.0, description: "Network Security Professional Exam" },
    { name: "Cloud Security Professional", vendor: "Palo Alto Networks", price: 200.0, description: "Cloud Security Professional Exam" },
    { name: "Security Operations Professional", vendor: "Palo Alto Networks", price: 200.0, description: "Security Operations Professional Exam" },
    { name: "Security Service Edge Engineer", vendor: "Palo Alto Networks", price: 250.0, description: "Security Service Edge Engineer Exam" },
    { name: "Network Security Analyst", vendor: "Palo Alto Networks", price: 250.0, description: "Network Security Analyst Exam" },
    { name: "Xsiam Anlyst", vendor: "Palo Alto Networks", price: 250.0, description: "Xsiam Anlyst Exam" },
    {name: "Xsiam Engineer", vendor: "Palo Alto Networks", price: 250.0, description: "Xsiam Engineer Exam"},
    {name: "Next-gen Firewall Engineer", vendor: "Palo Alto Networks", price: 250.0, description: "Next-gen Firewall Exam"},
    {name: "XDR Enginner", vendor: "Palo Alto Networks", price: 250.0, description: "XDR Engineer Exam"},
    {name: "XDR Analyst", vendor: "Palo Alto Networks", price: 250.0, description: "XDR Analyst Exam"},
    {name: "SD-Wan Engineer", vendor: "Palo Alto Networks", price: 250.0, description: "SD-Wan Engineer Exam"},
    {name: "XSOAR Engineer", vendor: "Palo Alto Networks", price: 250.0, description: "XSOAR Engineer Exam"},
    // Cisco
    { name: "CCNA", vendor: "Cisco", price: 200.0, description: "Cisco Certified Network Associate" },
    { name: "CCNP", vendor: "Cisco", price: 200.0, description: "Cisco Certified Network Professional" },
    { name: "CCNP Routing & Switching", vendor: "Cisco", price: 200.0, description: "Cisco Certified Network Professional - Routing & Switching" },
    { name: "CCNP Security", vendor: "Cisco", price: 200.0, description: "Cisco Certified Network Professional - Security" },
    { name: "CCNP Infrastructure", vendor: "Cisco", price: 200.0, description: "Cisco Certified Network Professional - Infrastructure" },
    
  ];

  console.log("📦 Seeding vouchers...");

 // First seed the static vouchers (non-Microsoft)
 for (const v of vouchers) {
  await prisma.voucher.upsert({
    where: { name: v.name },
    update: {},
    create: {
      name: v.name,
      price: v.price,
      description: v.description,
      vendorId: vendorMap[v.vendor],
    },
  });
  console.log(`✅ Seeded voucher: ${v.name}`);
}

// Now seed the dynamically scraped Microsoft vouchers
for (const v of microsoftVouchers) {
  await prisma.voucher.upsert({
    where: { name: v.name },
    update: {},
    create: {
      name: v.name,
      price: v.price,
      description: v.description,
      vendorId: vendorMap["Microsoft"],
    },
  });
  console.log(`✅ Seeded Microsoft cert: ${v.name}`);
}

console.log("🌱 Done seeding all vouchers!");
}

main()
.catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});