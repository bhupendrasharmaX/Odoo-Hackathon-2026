import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to get random item from array
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to get random number in range
const randomRange = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to subtract/add days to current date
const adjustDays = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  console.log('🧹 Clearing old records...');
  await prisma.auditLog.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  // 2. Create Roles
  console.log('👥 Creating roles...');
  const managerRole = await prisma.role.create({
    data: {
      name: 'Fleet Manager',
      permissions: [
        'vehicle:create', 'vehicle:read', 'vehicle:update', 'vehicle:delete',
        'maintenance:create', 'maintenance:read', 'maintenance:update', 'maintenance:delete',
        'trip:read', 'driver:read', 'fuel:read', 'expense:read', 'report:view', 'report:export'
      ],
    },
  });

  const dispatcherRole = await prisma.role.create({
    data: {
      name: 'Dispatcher',
      permissions: [
        'trip:create', 'trip:read', 'trip:update', 'trip:delete',
        'trip:dispatch', 'trip:complete', 'trip:cancel',
        'vehicle:read', 'driver:read'
      ],
    },
  });

  const safetyRole = await prisma.role.create({
    data: {
      name: 'Safety Officer',
      permissions: [
        'driver:create', 'driver:read', 'driver:update', 'driver:delete',
        'driver:monitor', 'vehicle:read', 'trip:read'
      ],
    },
  });

  const analystRole = await prisma.role.create({
    data: {
      name: 'Financial Analyst',
      permissions: [
        'fuel:create', 'fuel:read', 'fuel:update', 'fuel:delete',
        'expense:create', 'expense:read', 'expense:update', 'expense:delete',
        'report:view', 'report:export', 'vehicle:read', 'trip:read'
      ],
    },
  });

  const roles = [managerRole, dispatcherRole, safetyRole, analystRole];

  // 3. Create Users (10)
  console.log('👤 Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // Core Demo User matching frontend (Admin with Fleet Manager role)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Rajesh Sharma',
      mobileNumber: '9876543210',
      email: 'admin@transitops.com',
      password: passwordHash,
      roleId: managerRole.id,
      isMobileVerified: true,
      lastLogin: new Date(),
    },
  });

  const userNames = [
    'Amit Patel', 'Siddharth Rao', 'Vikram Singh', 'Priya Nair', 
    'Anjali Gupta', 'Deepak Verma', 'Sanjay Kumar', 'Rohan Mehta', 'Neha Joshi'
  ];

  const users = [adminUser];
  for (let i = 0; i < userNames.length; i++) {
    const role = i < 2 ? dispatcherRole : i < 4 ? safetyRole : i < 6 ? analystRole : managerRole;
    const phone = `987654321${i + 1}`;
    const user = await prisma.user.create({
      data: {
        name: userNames[i],
        mobileNumber: phone,
        email: `${userNames[i].toLowerCase().replace(' ', '.')}@transitops.com`,
        password: passwordHash,
        roleId: role.id,
        isMobileVerified: true,
      },
    });
    users.push(user);
  }

  // 4. Create Vehicles (50)
  console.log('🚛 Creating 50 vehicles...');
  const vehicleTypes = ['TRUCK', 'VAN', 'BUS', 'CAR', 'TRAILER'];
  const manufacturerNames = [
    { name: 'Tata Prima 4928', model: 'Prima 4928.S', type: 'TRUCK', cap: 28 },
    { name: 'Ashok Leyland 3520', model: 'AVTR 3520', type: 'TRUCK', cap: 35 },
    { name: 'Eicher Pro 3019', model: 'Pro 3019', type: 'TRUCK', cap: 19 },
    { name: 'Tata Ace Gold', model: 'Ace Gold Diesel', type: 'VAN', cap: 1.5 },
    { name: 'Force Traveller 3700', model: 'Traveller 3700', type: 'BUS', cap: 26 },
    { name: 'Mahindra Blazo X 35', model: 'Blazo X 35', type: 'TRUCK', cap: 35 },
    { name: 'BharatBenz 1617R', model: '1617R', type: 'TRUCK', cap: 16 }
  ];

  const vehicles = [];
  const stateCodes = ['MH', 'DL', 'GJ', 'KA', 'TN', 'RJ', 'UP', 'HR'];

  for (let i = 0; i < 50; i++) {
    const spec = manufacturerNames[i % manufacturerNames.length];
    const regNum = `${randomChoice(stateCodes)}-0${randomRange(1, 9)}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}-${randomRange(1000, 9999)}`;
    const vId = `V-${100 + i}`;
    
    const v = await prisma.vehicle.create({
      data: {
        id: vId,
        registrationNumber: regNum,
        vehicleName: spec.name,
        model: spec.model,
        vehicleType: spec.type as any,
        maximumCapacity: spec.cap,
        odometer: randomRange(10000, 150000),
        purchaseCost: randomRange(500000, 4500000),
        status: i === 0 ? 'AVAILABLE' : i % 15 === 0 ? 'IN_SHOP' : i % 25 === 0 ? 'RETIRED' : 'AVAILABLE',
        insuranceExpiry: adjustDays(randomRange(-15, 300)),
        yearOfManufacture: randomRange(2018, 2025),
      },
    });
    vehicles.push(v);
  }

  // 5. Create Drivers (100)
  console.log('👨‍✈️ Creating 100 drivers...');
  const firstNames = [
    'Amit', 'Rajesh', 'Suresh', 'Deepak', 'Vijay', 'Sunil', 'Arjun', 'Sanjay', 'Pankaj',
    'Ramesh', 'Harish', 'Vikram', 'Meera', 'Kavita', 'Priya', 'Neha', 'Ravi', 'Kiran',
    'Manoj', 'Anil', 'Kamal', 'Satish', 'Tarun', 'Yash', 'Alok', 'Gaurav', 'Sandeep'
  ];
  const lastNames = [
    'Kumar', 'Singh', 'Sharma', 'Verma', 'Patel', 'Yadav', 'Joshi', 'Gupta', 'Tiwari',
    'Nair', 'Mehta', 'Sharma', 'Reddy', 'Choudhary', 'Rao', 'Das', 'Sen', 'Gowda'
  ];
  const licenseCats = ['Class A', 'Class B', 'Class C', 'Heavy Vehicle License'];

  const drivers = [];
  for (let i = 0; i < 100; i++) {
    const fName = randomChoice(firstNames);
    const lName = randomChoice(lastNames);
    const name = `${fName} ${lName}`;
    const phone = `982345${String(i).padStart(4, '0')}`;
    const license = `${randomChoice(stateCodes)}-${randomRange(10, 99)}${randomRange(2010, 2024)}${randomRange(100000, 999999)}`;
    const score = randomRange(65, 100);

    const d = await prisma.driver.create({
      data: {
        id: `DRV-${1000 + i}`,
        name,
        phone: `+91 ${phone}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@transitops.com`,
        licenseNumber: license,
        licenseCategory: randomChoice(licenseCats),
        licenseExpiry: adjustDays(randomRange(-10, 600)),
        safetyScore: score,
        status: i === 0 ? 'AVAILABLE' : i % 20 === 0 ? 'SUSPENDED' : i % 15 === 0 ? 'OFF_DUTY' : 'AVAILABLE',
        experience: randomRange(2, 25),
        totalTrips: randomRange(10, 500),
        onTimeRate: Number((80 + Math.random() * 20).toFixed(1)),
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      },
    });
    drivers.push(d);
  }

  // 6. Create Trips (300)
  console.log('🗺️ Creating 300 trips...');
  const cities = [
    'Mumbai, Maharashtra', 'Pune, Maharashtra', 'Delhi, NCR', 'Jaipur, Rajasthan',
    'Ahmedabad, Gujarat', 'Surat, Gujarat', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu',
    'Kolkata, West Bengal', 'Patna, Bihar', 'Hyderabad, Telangana', 'Vizag, Andhra Pradesh',
    'Lucknow, UP', 'Varanasi, UP', 'Nagpur, Maharashtra', 'Bhopal, MP'
  ];
  const cargoTypes = ['Electronics', 'Textiles', 'Chemicals', 'Auto Parts', 'FMCG', 'Pharmaceuticals', 'Food Products', 'Building Materials'];

  const trips = [];
  // Ensure we have some scheduled, dispatched, completed, cancelled
  for (let i = 0; i < 300; i++) {
    const src = randomChoice(cities);
    let dest = randomChoice(cities);
    while (dest === src) {
      dest = randomChoice(cities);
    }

    const vehicle = randomChoice(vehicles);
    const driver = randomChoice(drivers);
    const distance = randomRange(100, 1200);
    
    // Status distribution
    let status: any = 'COMPLETED';
    if (i < 20) status = 'DRAFT'; // Scheduled
    else if (i < 50) status = 'DISPATCHED'; // Dispatched / In Transit
    else if (i < 65) status = 'CANCELLED';

    const revenue = distance * randomRange(45, 90);
    const fuelUsed = Math.round(distance / randomRange(3, 7));
    const fuelCost = fuelUsed * 90; // approx 90 INR/L

    const startDate = adjustDays(randomRange(-60, 5));
    const t = await prisma.trip.create({
      data: {
        id: `TR-${8000 + i}`,
        vehicleId: vehicle.id,
        driverId: driver.id,
        source: src,
        destination: dest,
        cargoType: randomChoice(cargoTypes),
        cargoWeight: Number((Math.random() * (vehicle.maximumCapacity - 0.5) + 0.5).toFixed(1)),
        plannedDistance: distance,
        actualDistance: status === 'COMPLETED' ? distance : null,
        fuelUsed: status === 'COMPLETED' ? fuelUsed : null,
        fuelCost: status === 'COMPLETED' ? fuelCost : null,
        revenue,
        status,
        startTime: startDate,
        endTime: status === 'COMPLETED' ? new Date(startDate.getTime() + (distance / 60) * 60 * 60 * 1000) : null,
        eta: new Date(startDate.getTime() + (distance / 50) * 60 * 60 * 1000),
      },
    });
    trips.push(t);
  }

  // Update statuses for assigned vehicle/driver on active trips
  const dispatchedTrips = trips.filter(t => t.status === 'DISPATCHED');
  for (const dt of dispatchedTrips) {
    await prisma.vehicle.update({
      where: { id: dt.vehicleId },
      data: { status: 'ON_TRIP' },
    });
    await prisma.driver.update({
      where: { id: dt.driverId },
      data: { status: 'ON_TRIP' },
    });
  }

  // 7. Create Fuel Logs (150)
  console.log('⛽ Creating 150 fuel logs...');
  const fuelStations = ['Indian Oil, Highway', 'HP Petrol, Junction', 'BPCL, Bypass', 'Shell Plaza', 'Reliance Fuels'];
  
  for (let i = 0; i < 150; i++) {
    const vehicle = randomChoice(vehicles);
    const quantity = randomRange(20, 200);
    const costPerLiter = Number((88 + Math.random() * 5).toFixed(2));
    const cost = quantity * costPerLiter;
    const trip = trips.find(t => t.vehicleId === vehicle.id && t.status === 'COMPLETED');

    await prisma.fuelLog.create({
      data: {
        id: `FL-${2000 + i}`,
        vehicleId: vehicle.id,
        tripId: trip?.id || null,
        driverName: randomChoice(drivers).name,
        fuelType: 'Diesel',
        liters: quantity,
        costPerLiter,
        cost,
        odometer: vehicle.odometer - randomRange(100, 5000),
        station: randomChoice(fuelStations),
        date: adjustDays(randomRange(-60, 0)),
      },
    });
  }

  // 8. Create Maintenance Logs (80)
  console.log('🔧 Creating 80 maintenance logs...');
  const maintTypes = ['Engine Diagnostics', 'Routine Service', 'Brake Pad Replacement', 'Oil Change', 'Tire Rotation', 'Full Cleaning', 'Electrical Repair'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  for (let i = 0; i < 80; i++) {
    const vehicle = randomChoice(vehicles);
    const cost = randomRange(1500, 50000);
    const status: any = i < 10 ? 'IN_PROGRESS' : i < 20 ? 'SCHEDULED' : 'COMPLETED';

    await prisma.maintenanceLog.create({
      data: {
        id: `MNT-${600 + i}`,
        vehicleId: vehicle.id,
        title: randomChoice(maintTypes),
        description: 'Periodic service and checks according to logs.',
        priority: randomChoice(priorityOptions),
        cost,
        status,
        startDate: adjustDays(randomRange(-45, 10)),
        completedDate: status === 'COMPLETED' ? adjustDays(randomRange(-44, 0)) : null,
        mechanic: randomChoice(['Suresh Kumar', 'Karan Dev', 'Sanjay Rawat', 'Ajay Verma']),
      },
    });
  }

  // 9. Create Expenses (300)
  console.log('💸 Creating 300 expenses...');
  const expCategories = ['Fuel', 'Maintenance', 'Insurance', 'Toll', 'Driver Allowance', 'Parking', 'Fines', 'Other'];
  
  for (let i = 0; i < 300; i++) {
    const cat = randomChoice(expCategories);
    const amount = cat === 'Insurance' ? randomRange(15000, 45000) : cat === 'Maintenance' ? randomRange(2000, 25000) : randomRange(150, 3000);
    const status: any = i % 10 === 0 ? 'PENDING' : i % 25 === 0 ? 'REJECTED' : 'APPROVED';
    const vehicle = randomChoice(vehicles);
    const trip = trips.find(t => t.vehicleId === vehicle.id);

    await prisma.expense.create({
      data: {
        id: `EXP-${4000 + i}`,
        vehicleId: vehicle.id,
        tripId: trip?.id || null,
        expenseType: cat,
        amount,
        description: `Utility bill or charges for category ${cat}`,
        status,
        date: adjustDays(randomRange(-60, 0)),
      },
    });
  }

  // 10. Create Notifications (20)
  console.log('🔔 Creating notifications...');
  const notificationTitles = [
    'License Expiring Soon', 'Maintenance Due Alert', 'PUC Check Overdue',
    'Route Delay Warning', 'Fuel Audit Log flag', 'Insurance Renewal Required'
  ];
  
  for (let i = 0; i < 20; i++) {
    await prisma.notification.create({
      data: {
        title: randomChoice(notificationTitles),
        message: `Notification details and system message log event number ${i + 1}.`,
        type: i % 4 === 0 ? 'WARNING' : i % 5 === 0 ? 'ALERT' : 'INFO',
        isRead: i < 5,
      },
    });
  }

  console.log('🚀 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
