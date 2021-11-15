export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  console.log(date)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  console.log(ye)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  console.log(mo)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  console.log(da)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}