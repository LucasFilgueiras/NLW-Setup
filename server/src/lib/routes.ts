import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { prisma } from "./prisma"
import { z } from 'zod'

export const AppRoutes = async (app: FastifyInstance) => {
    app.post("/habits", async (req, res) => {
        const createHabitsBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const {title, weekDays} = createHabitsBody.parse(req.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create : weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })

        console.log('deu certo');
        
    })

    app.get("/day", async (req, res) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const {date} = getDayParams.parse(req.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day  = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true,
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.patch("/habits/:id/toggle", async (req, res) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(req.params)

        const today = dayjs().startOf("day").toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
    })

    app.get("/summary", async (req, res) => {
        const summary = await prisma.$queryRaw`
            SELECT d.id, d.date, 
            (SELECT CAST(COUNT(*) AS float) FROM day_habits dh WHERE dh.day_id=d.id) AS completed,
            (SELECT CAST(COUNT(*) AS float) FROM habit_week_days hwd JOIN habits h ON h.id=hwd.habit_id WHERE hwd.week_day = CAST(strftime('%w', d.date/1000.0, 'unixepoch') AS int) AND h.created_at <= d.date) AS amount
            FROM days d
        `

        return summary
    })
}

