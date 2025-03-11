/**
 * Validators for foreign user data
 */

/**
 * Validates passport number
 * Most passport numbers have between 6-9 characters, may include letters and numbers
 * 
 * @param {string} passport - Passport number to validate
 * @return {string} Error message if invalid, empty string if valid
 */
export const validatePassport = (passport) => {
  const trimmedPassport = passport.trim();

  if (!trimmedPassport) {
    return "Número do passaporte é obrigatório";
  }

  if (trimmedPassport.length < 6) {
    return "Número do passaporte deve ter pelo menos 6 caracteres";
  }

  if (trimmedPassport.length > 15) {
    return "Número do passaporte não deve exceder 15 caracteres";
  }

  // Regex para permitir letras, números e alguns caracteres especiais comuns em passaportes
  const validPassportRegex = /^[A-Za-z0-9\-\.\/]{6,15}$/;
  if (!validPassportRegex.test(trimmedPassport)) {
    return "Número do passaporte contém caracteres inválidos";
  }

  return "";
};

/**
 * Validates nationality of a user
 * 
 * @param {string} nationality - User's nationality to validate
 * @return {string} Error message if invalid, empty string if valid
 */
export const validateNationality = (nationality) => {
  const trimmedNationality = nationality.trim();

  if (!trimmedNationality) {
    return "Nacionalidade é obrigatória";
  }

  if (trimmedNationality.length < 3) {
    return "Nacionalidade deve ter pelo menos 3 caracteres";
  }

  // Regex para permitir apenas letras e espaços
  const validNationalityRegex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
  if (!validNationalityRegex.test(trimmedNationality)) {
    return "Nacionalidade deve conter apenas letras";
  }

  return "";
};