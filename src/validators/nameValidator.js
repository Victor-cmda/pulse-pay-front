export const validateFullName = (name) => {
  const trimmedName = name.trim().replace(/\s+/g, " ");

  const validations = [
    {
      condition: !trimmedName,
      error: "Nome é obrigatório",
    },
    {
      condition: trimmedName.length < 3,
      error: "Nome deve ter pelo menos 3 caracteres",
    },
    {
      condition: trimmedName.split(" ").length < 2,
      error: "Digite nome e sobrenome",
    },
    {
      condition: trimmedName.split(" ").some((word) => word.length < 2),
      error: "Cada parte do nome deve ter pelo menos 2 caracteres",
    },
    {
      condition: !/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(
        trimmedName
      ),
      error: "Nome deve conter apenas letras",
    },
  ];

  const error = validations.find((v) => v.condition);
  return error ? error.error : "";
};

export const validateCompanyName = (name) => {
  const trimmedName = name.trim().replace(/\s+/g, " ");

  const validations = [
    {
      condition: !trimmedName,
      error: "Razão Social é obrigatória",
    },
    {
      condition: trimmedName.length < 4,
      error: "Razão Social deve ter pelo menos 4 caracteres",
    },
    {
      condition: !/^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ& .-]+$/.test(
        trimmedName
      ),
      error: "Razão Social contém caracteres inválidos",
    },
  ];

  const error = validations.find((v) => v.condition);
  return error ? error.error : "";
};
