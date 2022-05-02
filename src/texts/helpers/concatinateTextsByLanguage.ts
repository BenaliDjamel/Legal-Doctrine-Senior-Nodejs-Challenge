export async function concatinateTextsByLanguage(texts) {
  let fullArabicText = '';
  let fullFrenchText = '';
  let fullEnglishText = '';

  for await (const text of texts) {
    fullArabicText += text.content.ar + ' ';
    fullFrenchText += text.content.fr + ' ';
    fullEnglishText += text.content.en + ' ';
  }
  return {
    fullArabicText: fullArabicText.trim(),
    fullFrenchText: fullFrenchText.trim(),
    fullEnglishText: fullEnglishText.trim(),
  };
}
