export const validateDocument = (document) => {
  document = document.replace(/[^\d]+/g, "");
  if (document.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(document)) return false;

  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(document.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(document.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(document.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(document.substring(10, 11))) return false;

  return true;
};

export const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(0)) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(1)) return false;

  return true;
};

export const formatDocument = (value) => {
  const onlyNumbers = value.replace(/\D/g, "");

  if (onlyNumbers.length <= 11) {
    return {
      formattedValue: onlyNumbers
        .replace(/(\d{3})(?=\d)/g, "$1.")
        .replace(/(\d{3})(?=\d)/g, "$1.")
        .replace(/(\d{3})(?=\d)/g, "$1-")
        .slice(0, 14),
      type: "CPF",
    };
  }

  return {
    formattedValue: onlyNumbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18),
    type: "CNPJ",
  };
};
