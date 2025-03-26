const promptAdapter = (texto) => {
  const promptRegexp =
    /<tr>\s*<td class="category"><strong>(.*?)<\/strong><\/td>\s*<td class="category score">(.*?)<\/td>\s*<\/tr>/g;

  const resultingText = texto.replace(
    promptRegexp,
    (match, category, score) =>
      `<tr><td colspan="2"><details><summary><strong>${category} (${score})</strong></summary></details></td></tr>`
  );

  return resultingText;
};

export default promptAdapter;
