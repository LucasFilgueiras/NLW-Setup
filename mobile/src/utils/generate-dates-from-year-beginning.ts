import dayjs from 'dayjs'

export const generateDatesFromYearBeginning = () => {
    const firstDayOfTheYear = dayjs().startOf('year') //Pega o primeiro dia do ano
    const today = new Date() // Pega a data atual

    const dates = [] // Array para guardar as datas
    let compareDate = firstDayOfTheYear

    // Enquanto a data do ano for anterior a data atual, atribua a data ao array dates e adicione mais 1 ao compareDate 
    while (compareDate.isBefore(today)) {
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}