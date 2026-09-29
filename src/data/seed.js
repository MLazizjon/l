/* Boshlang'ich (demo) ma'lumotlar. Keyinchalik API bilan almashtiriladi. */

const users = [
  { id: 'u1', name: 'Muhammad', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 'u2', name: 'Dilnoza Karimova', username: 'dispetcher', password: 'user123', role: 'user' },
  { id: 'u3', name: 'Sardor Olimov', username: 'user', password: 'user123', role: 'user' },
];

const drivers = [
  { id: 'd1', name: 'Jasur Rahimov', phone: '+998 90 123 45 67', truck: 'MAN TGX 18.440', plate: '30 A 145 BA', city: 'Samarqand', experience: '12', status: "Yo'lda" },
  { id: 'd2', name: 'Otabek Yusupov', phone: '+998 91 555 12 34', truck: 'Volvo FH 460', plate: '01 B 772 CA', city: 'Toshkent', experience: '8', status: 'Faol' },
  { id: 'd3', name: 'Sherzod Aliyev', phone: '+998 93 310 88 20', truck: 'Kamaz 5490', plate: '80 C 901 DA', city: 'Buxoro', experience: '15', status: 'Faol' },
  { id: 'd4', name: 'Bekzod Tursunov', phone: '+998 97 402 11 09', truck: 'Howo A7', plate: '60 D 333 AA', city: 'Andijon', experience: '5', status: 'Dam olishda' },
  { id: 'd5', name: 'Farrux Qodirov', phone: '+998 99 870 65 43', truck: 'Shacman X3000', plate: '30 E 520 BB', city: 'Samarqand', experience: '9', status: "Yo'lda" },
  { id: 'd6', name: 'Ulug\u02BBbek Nazarov', phone: '+998 94 222 70 70', truck: 'Isuzu NQR 90', plate: '40 F 118 CC', city: "Farg'ona", experience: '6', status: 'Faol' },
  { id: 'd7', name: 'Rustam Ergashev', phone: '+998 90 909 30 30', truck: 'Mercedes Actros', plate: '85 G 640 DD', city: 'Navoiy', experience: '18', status: "Yo'lda" },
  { id: 'd8', name: 'Azizbek Mirzayev', phone: '+998 88 144 52 52', truck: 'DAF XF 480', plate: '70 H 207 AB', city: 'Qarshi', experience: '4', status: 'Faol' },
];

const brokers = [
  { id: 'b1', name: 'Nodir Xoliqov', company: 'TezYuk Logistics', phone: '+998 90 700 10 10', commission: '5', status: 'Faol' },
  { id: 'b2', name: 'Malika Saidova', company: 'Ipak Yo\u02BBli Cargo', phone: '+998 91 300 44 55', commission: '4', status: 'Faol' },
  { id: 'b3', name: 'Akmal Hamidov', company: 'Asia Trans Broker', phone: '+998 93 555 66 77', commission: '6', status: 'Faol' },
  { id: 'b4', name: 'Javlon Sobirov', company: 'Registon Freight', phone: '+998 97 111 22 33', commission: '3.5', status: 'Nofaol' },
  { id: 'b5', name: 'Kamola Rashidova', company: 'Zarafshon Ekspeditor', phone: '+998 99 404 04 04', commission: '5', status: 'Faol' },
];

const factories = [
  { id: 'f1', name: 'Zarafshon Sement', city: 'Samarqand', product: 'Sement M400, M500', contact: 'Ilhom Toshev', phone: '+998 66 233 10 10', status: 'Hamkor' },
  { id: 'f2', name: 'Oltin Don un kombinati', city: 'Jizzax', product: 'Un, kepak', contact: 'Botir Jo\u02BBrayev', phone: '+998 72 226 40 40', status: 'Hamkor' },
  { id: 'f3', name: 'Navro\u02BBz Tekstil', city: 'Buxoro', product: 'Ip-kalava, mato', contact: 'Gulnora Aminova', phone: '+998 65 221 55 55', status: 'Hamkor' },
  { id: 'f4', name: 'Vodiy Metall', city: 'Andijon', product: 'Armatura, profil', contact: 'Sanjar Ismoilov', phone: '+998 74 223 90 90', status: 'Muzokarada' },
  { id: 'f5', name: 'Qarshi Shisha', city: 'Qarshi', product: 'Oyna, shisha idish', contact: 'Rahim Normatov', phone: '+998 75 225 30 30', status: 'Hamkor' },
  { id: 'f6', name: 'Orol Tuz', city: 'Nukus', product: 'Osh tuzi', contact: 'Aybek Qalliyev', phone: '+998 61 222 11 00', status: 'Nofaol' },
];

const telegram = [
  { id: 't1', name: 'Yuk Markazi UZ', username: '@yuk_markazi_uz', type: 'Guruh', members: '48200', status: 'Ulangan', note: 'Asosiy yuk e\u02BBlonlari guruhi' },
  { id: 't2', name: 'Logistika Samarqand', username: '@logistika_smq', type: 'Guruh', members: '12650', status: 'Ulangan', note: 'Samarqand yo\u02BBnalishlari' },
  { id: 't3', name: 'YukCRM yangiliklari', username: '@yukcrm_news', type: 'Kanal', members: '3120', status: 'Ulangan', note: 'Kompaniya kanali' },
  { id: 't4', name: 'Haydovchilar bot', username: '@yukcrm_driver_bot', type: 'Bot', members: '86', status: 'Ulangan', note: 'Haydovchilarga buyurtma yuborish' },
  { id: 't5', name: 'Fura Toshkent', username: '@fura_toshkent', type: 'Guruh', members: '27400', status: "O'chirilgan", note: 'Vaqtincha to\u02BBxtatilgan' },
];

const cargo = [
  { id: 'c1', title: 'Sement M400', factoryId: 'f1', from: 'Samarqand', to: 'Toshkent', weight: '22', price: '6800000', driverId: 'd1', brokerId: 'b1', status: "Yo'lda", date: '2026-09-26' },
  { id: 'c2', title: 'Un, 50 kg qop', factoryId: 'f2', from: 'Jizzax', to: 'Termiz', weight: '20', price: '7900000', driverId: 'd5', brokerId: 'b2', status: "Yo'lda", date: '2026-09-25' },
  { id: 'c3', title: 'Ip-kalava', factoryId: 'f3', from: 'Buxoro', to: 'Andijon', weight: '14', price: '9200000', driverId: 'd7', brokerId: 'b3', status: "Yo'lda", date: '2026-09-24' },
  { id: 'c4', title: 'Oyna listlari', factoryId: 'f5', from: 'Qarshi', to: 'Samarqand', weight: '12', price: '4100000', driverId: '', brokerId: 'b5', status: 'Kutilmoqda', date: '2026-09-27' },
  { id: 'c5', title: 'Armatura 12 mm', factoryId: 'f4', from: 'Andijon', to: 'Navoiy', weight: '24', price: '10500000', driverId: '', brokerId: 'b1', status: 'Kutilmoqda', date: '2026-09-28' },
  { id: 'c6', title: 'Sement M500', factoryId: 'f1', from: 'Samarqand', to: 'Buxoro', weight: '22', price: '4600000', driverId: 'd3', brokerId: 'b5', status: 'Yetkazildi', date: '2026-09-12' },
  { id: 'c7', title: 'Mato rulonlari', factoryId: 'f3', from: 'Buxoro', to: 'Toshkent', weight: '10', price: '7300000', driverId: 'd2', brokerId: 'b2', status: 'Yetkazildi', date: '2026-08-30' },
  { id: 'c8', title: 'Kepak', factoryId: 'f2', from: 'Jizzax', to: 'Samarqand', weight: '18', price: '2900000', driverId: 'd1', brokerId: 'b1', status: 'Yetkazildi', date: '2026-08-18' },
  { id: 'c9', title: 'Shisha idishlar', factoryId: 'f5', from: 'Qarshi', to: "Farg'ona", weight: '9', price: '8800000', driverId: 'd6', brokerId: 'b3', status: 'Yetkazildi', date: '2026-08-05' },
  { id: 'c10', title: 'Profil truba', factoryId: 'f4', from: 'Andijon', to: 'Toshkent', weight: '20', price: '5200000', driverId: 'd8', brokerId: 'b4', status: 'Bekor qilindi', date: '2026-07-22' },
  { id: 'c11', title: 'Sement M400', factoryId: 'f1', from: 'Samarqand', to: 'Qarshi', weight: '22', price: '5100000', driverId: 'd5', brokerId: 'b1', status: 'Yetkazildi', date: '2026-07-14' },
  { id: 'c12', title: 'Osh tuzi', factoryId: 'f6', from: 'Nukus', to: 'Toshkent', weight: '25', price: '12400000', driverId: 'd7', brokerId: 'b3', status: 'Yetkazildi', date: '2026-06-20' },
  { id: 'c13', title: 'Un, 25 kg qop', factoryId: 'f2', from: 'Jizzax', to: 'Urganch', weight: '20', price: '11800000', driverId: 'd3', brokerId: 'b2', status: 'Yetkazildi', date: '2026-05-28' },
  { id: 'c14', title: 'Ip-kalava', factoryId: 'f3', from: 'Buxoro', to: 'Namangan', weight: '12', price: '8600000', driverId: 'd2', brokerId: 'b5', status: 'Yetkazildi', date: '2026-04-16' },
  { id: 'c15', title: 'Sement M500', factoryId: 'f1', from: 'Samarqand', to: 'Jizzax', weight: '22', price: '3400000', driverId: 'd1', brokerId: 'b1', status: 'Yetkazildi', date: '2026-05-06' },
];

const seed = { users, drivers, brokers, factories, telegram, cargo };
export default seed;
