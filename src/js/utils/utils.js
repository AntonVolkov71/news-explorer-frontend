//мои помощнички 


//Изменить дату назад/вперед
const getMetadataKeys = (dateNow, days) => {
  const dateOffset = (24 * 60 * 60 * 1000) * days;
  
  let dateCorrect = dateNow;
  dateNow.setTime(dateNow.getTime() + dateOffset);
  dateCorrect = dateCorrect.toISOString();

  return dateCorrect
}

export { getMetadataKeys }