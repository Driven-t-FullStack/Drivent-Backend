import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { truncate } from "fs/promises";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  await prisma.ticketType.createMany({
    data: [
      { name: "Presencial + Sem Hotel", price: 250, isRemote: false, includesHotel: false },
      { name: "Presencial + Com hotel", price: 600, isRemote: false, includesHotel: true },
      { name: "Online", price: 100, isRemote: true, includesHotel: false },
    ],
  });

  await prisma.hotel.create({
    data: {
      name: "Driven Palace",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Gd6xQoVvX0CaHeRzwbkRlAk76N_k40_jWQ&usqp=CAU",
      type: "Single, Double e Triple",
      Rooms: {
        create: [
          { name: "01", capacity: 3 },
          { name: "02", capacity: 2 },
          { name: "03", capacity: 1 },
          { name: "04", capacity: 3 },
          { name: "05", capacity: 3 },
          { name: "06", capacity: 2 },
          { name: "07", capacity: 3 },
        ],
      },
    },
  });

  await prisma.hotel.create({
    data: {
      name: "Driven Resort",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZj5ETDAoTl4de8QyVL-yrzZ-5LXbPL62nBg&usqp=CAU",
      type: "Single e Double",
      Rooms: {
        create: [
          { name: "01", capacity: 1 },
          { name: "02", capacity: 1 },
          { name: "03", capacity: 1 },
          { name: "04", capacity: 2 },
          { name: "05", capacity: 2 },
        ],
      },
    },
  });
  await prisma.hotel.create({
    data: {
      name: "Driven World",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrpBJDSdUoa_MHQXKsg3lxvuxTqYCL7SU5XA&usqp=CAU",
      type: "Single e Double",
      Rooms: {
        create: [
          { name: "01", capacity: 2 },
          { name: "02", capacity: 2 },
          { name: "03", capacity: 1 },
          { name: "04", capacity: 2 },
          { name: "05", capacity: 2 },
          { name: "06", capacity: 1 },
        ],
      },
    },
  });
  const firstDate = new Date("2023-03-17");
  const secondDate = new Date("2023-03-18");

  const activityDateOne = await prisma.activityDate.create({ data: { date: firstDate } });
  const activityDateTwo = await prisma.activityDate.create({ data: { date: secondDate } });

  const hallOne = await prisma.hall.create({ data: { name: "Auditório Principal", capacity: 25 } });
  const hallTwo = await prisma.hall.create({ data: { name: "Auditório Lateral", capacity: 50 } });
  const hallThree = await prisma.hall.create({ data: { name: "Sala de Workshop", capacity: 4 } });

  await prisma.activity.create({
    data: {
      name: "Busca binária: Aprendendo algoritmo",
      startTime: new Date("2023-03-17T09:00:00.000"),
      endTime: new Date("2023-03-17T10:00:00.000"),
      activityDateId: activityDateOne.id,
      hallId: hallOne.id,
    },
  });

  await prisma.activity.create({
    data: {
      name: "Hashtable: Quando usar?",
      startTime: new Date("2023-03-17T14:00:00.000"),
      endTime: new Date("2023-03-17T15:00:00.000"),
      activityDateId: activityDateOne.id,
      hallId: hallOne.id,
    },
  });

  await prisma.activity.create({
    data: {
      name: "Palestra y",
      startTime: new Date("2023-03-17T09:00:00.000"),
      endTime: new Date("2023-03-17T12:00:00.000"),
      activityDateId: activityDateOne.id,
      hallId: hallTwo.id,
    },
  });

  await prisma.activity.create({
    data: {
      name: "Palestra z",
      startTime: new Date("2023-03-17T09:15:00.000"),
      endTime: new Date("2023-03-17T13:00:00.000"),
      activityDateId: activityDateOne.id,
      hallId: hallTwo.id,
    },
  });

  await prisma.activity.create({
    data: {
      name: "Palestra w",
      startTime: new Date("2023-03-17T10:30:00.000"),
      endTime: new Date("2023-03-17T12:00:00.000"),
      activityDateId: activityDateOne.id,
      hallId: hallThree.id,
    },
  });

  await prisma.activity.create({
    data: {
      name: "Palestra g",
      startTime: new Date("2023-03-18T15:00:00.000"),
      endTime: new Date("2023-03-18T18:00:00.000"),
      activityDateId: activityDateTwo.id,
      hallId: hallOne.id,
    },
  });

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
