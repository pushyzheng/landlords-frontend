let cards = [
  {num: 1},
  {num: 2},
  {num: 3},
  {num: 4},
  {num: 5}
]

let selectList = [1, 3];
let index = 0;

let result = [];
for (let i = 0; i < cards.length; i++) {
  if (selectList[index] == i) {
    result.push(cards[i]);
    index++;
  }
}

console.log(result);
