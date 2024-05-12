export const toFullName = (lastName: string, middleName: string, firstName: string) => {
  return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
}

export const convertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const separationFullName = (fullName: string) => {
  const result = {
    firstName: '',
    middleName: '',
    lastName: ''
  }
  const arrFullName = fullName.trim().split(' ')?.filter(Boolean)
  if (arrFullName?.length === 1) {
    result.lastName = arrFullName.join()
  } else if (arrFullName.length === 2) {
    result.lastName = arrFullName[1]
    result.firstName = arrFullName[0]
  } else if (arrFullName.length >= 3) {
    result.lastName = arrFullName[arrFullName.length - 1]
    result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
    result.firstName = arrFullName[0]
  }

  return result
}
