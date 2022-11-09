const generateRandomNumbers = (max, times) => {
  const randoms = new Set();
  let num;
  while (randoms.size !== times) {
    num = Math.floor(Math.random() * max);
    if (!randoms.has(num)) {
      randoms.add(num);
    }
  }

  return randoms;
};

export default generateRandomNumbers;
