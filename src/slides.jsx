import { Link } from "react-router";
import Game from "./game/Game.jsx";

/* Each slide is just a component. Add, remove or reorder them here —
   the router (/#/1, /#/2, ...) follows this list automatically. */

function Title() {
  return (
    <>
      <p className="kicker">Ћао! Ја сам Давид</p>
      <h1>Шта ради софтверски инжењер?</h1>
      <p className="lead">Ја дајем инструкције рачунарима шта да раде.</p>
    </>
  );
}

function WhatIsSoftware() {
  return (
    <>
      <h2>Шта је програм?</h2>
      <p className="lead">
        Програм је списак <strong>инструкција</strong> који говори рачунару шта да ради.
      </p>
      <div className="compare">
        <div className="box">
          <div className="big">📖</div>
          <p>Рецепт говори кувару<br />како да направи торту.</p>
        </div>
        <div className="box">
          <div className="big">💻</div>
          <p>Програм говори рачунару<br />како да уради посао.</p>
        </div>
      </div>
      <p className="note">Рачунари су брзи, али раде само оно што им кажемо!</p>
    </>
  );
}

function TwoKinds() {
  return (
    <>
      <h2>Две врсте софтвера</h2>
      <div className="compare">
        <div className="box">
          <h3>Системски софтвер</h3>
          <p>Скривени помагачи.</p>
          <p>Они покрећу сам рачунар: укључивање, екран, тастатуру, интернет.</p>
        </div>
        <div className="box">
          <h3>Апликације</h3>
          <p>Програми које ви користите.</p>
          <p>Игрице, видео-снимци, цртање, мапе, поруке, музика.</p>
        </div>
      </div>
    </>
  );
}

function IBuildApps() {
  return (
    <>
      <h2>Ја правим апликације</h2>
      <p className="lead">Апликација се састоји од:</p>
      <div className="grid3">
        <div className="box">
          <div className="big">🖼️</div>
          <h3>Екрана</h3>
          <p>Оно што видите</p>
        </div>
        <div className="box">
          <div className="big">👆</div>
          <h3>Дугмића</h3>
          <p>Оно што притискате</p>
        </div>
        <div className="box">
          <div className="big">🧠</div>
          <h3>Меморије</h3>
          <p>Оно што памти, на пример ваш најбољи резултат</p>
        </div>
      </div>
    </>
  );
}

function GameSlide() {
  return <Game />;
}

function HowIMakeIt() {
  return (
    <>
      <h2>Како правим апликацију</h2>
      <ol className="steps">
        <li><strong>Смислим</strong>: шта апликација треба да ради?</li>
        <li><strong>Напишем</strong> упутства (код)</li>
        <li><strong>Испробам</strong>: да ли ради?</li>
        <li><strong>Поправим</strong> грешке. Зовемо их „багови“ 🐛</li>
        <li><strong>Поделим</strong> је са људима!</li>
      </ol>
    </>
  );
}

function QuestionsIntro() {
  return (
    <>
      <h1>Ваш ред! ✋</h1>
      <p className="lead">Да видимо шта знате.</p>
    </>
  );
}

const question = (text, hint, kicker = "Подигните руку ✋") =>
  function Question() {
    return (
      <>
        <p className="kicker">{kicker}</p>
        <h1>{text}</h1>
        {hint && <p className="note">{hint}</p>}
      </>
    );
  };

function FindTheBug() {
  const gameSlide = slides.indexOf(GameSlide) + 1;
  return (
    <>
      <h1>Хајде да пронађемо баг! 🐛</h1>
      <p className="lead">Када падне шестица, играч треба да баца поново. Али у нашој игри не баца!</p>
      <p className="note">Хајде да погледамо код. Ко може да пронађе грешку?</p>
      <Link className="back-link" to={`/${gameSlide}`}>Назад у игру →</Link>
    </>
  );
}

function ThankYou() {
  return (
    <>
      <h1>Хвала вам! 🙂</h1>
      <p className="lead">Имате ли питања за мене?</p>
    </>
  );
}

const slides = [
  Title,
  WhatIsSoftware,
  TwoKinds,
  IBuildApps,
  GameSlide,
  HowIMakeIt,
  QuestionsIntro,
  question("Ко је користио рачунар?"),
  question("Ко користи телефон или таблет?"),
  question("Како сте користили рачунар, телефон или таблет?", null, "Реците ми 💬"),
  question("Да можете да направите било коју апликацију, шта би она радила?", null, "Реците ми 💬"),
  FindTheBug,
  ThankYou,
];

export default slides;
