//мои помощнички 


//Изменить дату назад/вперед
const getMetadataKeys = (dateNow, days) => {
  const dateOffset = (24 * 60 * 60 * 1000) * days;

  let dateCorrect = dateNow;
  dateNow.setTime(dateNow.getTime() + dateOffset);
  dateCorrect = dateCorrect.toISOString();

  return dateCorrect;
}

//Установка необходимого формата даты ( 1 декабря, 1800)
const setFormatDate = (importDate) => {
  const date = new Date(importDate);

  const dayMonth = {
    month: 'long',
    day: 'numeric',

  };
  const year = {
    year: 'numeric',
  };

  const resDate = `${date.toLocaleString("ru", dayMonth)}, ${date.toLocaleString("ru", year)}`;
  return resDate;
}

const cutEar = (num) => {
  num += '';
  if (num.slice(-1) === '1' & num.slice(-2) !== '11') {
    return `сохраненная статья`;
  }
  return `сохраненных статей`;
}

export { getMetadataKeys, setFormatDate, cutEar }