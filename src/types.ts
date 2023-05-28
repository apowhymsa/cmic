export interface IUser {
  email: string;
  password: string;
  nickname?: string;
  firstName?: string;
  surname?: string;
  image?: File | Blob | string;
}

// enum AuthEmailError {
//   // Не введена почта
//   'auth/invalid-email' = 'Некоректна електронна адреса',
//   'auth/missing-email' = 'Некоректна електронна адреса',
//   // Электронная почта уже существует
//   'auth/email-already-in-use' = 'Обліковий запис з введеними даними вже існує',
// }

// enum AuthPasswordError {
//   // Пароль больше 5 символов
//   'auth/weak-password' = 'Пароль повинен мати більше ніж 5 символів',
//   // Не введён пароль
//   'auth/missing-password' = 'Некоректний пароль',
// }

// type AuthEmailErrorStrings = Record<string, string>;
// type AuthPasswordErrorStrings = Record<string, string>;
// const authEmailErrorStrings: AuthEmailErrorStrings =
//   AuthEmailError as AuthEmailErrorStrings;
// const authPasswordErrorStrings: AuthPasswordErrorStrings =
//   AuthPasswordError as AuthPasswordErrorStrings;

// export { authEmailErrorStrings, authPasswordErrorStrings };
