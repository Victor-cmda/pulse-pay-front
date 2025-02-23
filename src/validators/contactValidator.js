export const validateEmail = (email) => {
  if (!email) return "E-mail é obrigatório";

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) {
    return "E-mail inválido";
  }

  return "";
};

export const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.startsWith("0")) {
    return {
      formattedValue: "",
      error: "Número não pode começar com 0",
    };
  }

  let formattedValue = numbers;
  if (numbers.length <= 11) {
    formattedValue = numbers
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  }

  return {
    formattedValue: formattedValue.slice(0, 15),
    error: validatePhone(numbers),
  };
};

export const validatePhone = (phone) => {
  if (!phone) return "Telefone é obrigatório";

  const numbers = phone.replace(/\D/g, "");

  if (numbers.length < 10 || numbers.length > 11) {
    return "Telefone deve ter 10 ou 11 dígitos";
  }

  if (numbers.length === 11 && numbers[2] !== "9") {
    return "Celular deve começar com 9";
  }

  const ddd = numbers.substring(0, 2);
  const validDDDs = Array.from({ length: 99 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  if (!validDDDs.includes(ddd)) {
    return "DDD inválido";
  }

  if (new Set(numbers.split("")).size === 1) {
    return "Número inválido";
  }

  return "";
};
