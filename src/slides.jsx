import { Link } from "react-router";
import Game from "./game/Game.jsx";

/* Each slide is just a component. Add, remove or reorder them here —
   the router (/#/1, /#/2, ...) follows this list automatically. */

function Title() {
  return (
    <>
      <p className="kicker">Ћао! Ја сам Давид</p>
      <h1>Шта ради софтверски инжењер?</h1>
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

function WhatIsApp() {
  return (
    <>
      <h2>Шта је апликација?</h2>
      <p className="lead small">
        Апликација је <strong>програм</strong> који је намењен људима да обаве неки посао.
      </p>
      <p className="note">Састоји се од:</p>
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

// Slike: Wikimedia Commons
// golub.jpg  - "A Sig Corps pigeon has a message capsule attached to its leg" (1944), javno vlasnistvo
// postar.jpg - "Postman, 1992", Sven Tideman, CC0
// biblioteka.jpg - "Stockholms stadsbibliotek rotundan", javno vlasnistvo
function BeforeComputers() {
  return (
    <>
      <h2>Како су људи некада слали поруке?</h2>
      <div className="compare">
        <div className="box">
          <div className="photo">
            <img src="images/golub.jpg" alt="Голуб писмоноша" />
          </div>
          <h3>Голуб писмоноша</h3>
          <p className="caption">Војници 1944. године стављају поруку у малу капсулу на нози голуба.</p>
        </div>
        <div className="box">
          <div className="photo">
            <img src="images/postar.jpg" alt="Поштар" />
          </div>
          <h3>Поштар</h3>
        </div>
      </div>
      <p className="lead">Како је рачунар могао да побољша слање порука?</p>
    </>
  );
}

function BigLibrary() {
  return (
    <>
      <h2>Велика библиотека 📚</h2>
      <div className="photo wide">
        <img src="images/biblioteka.jpg" alt="Градска библиотека у Стокхолму" />
      </div>
      <p className="caption">Градска библиотека у Стокхолму, Шведска</p>
      <p className="lead">Како би рачунари могли да побољшају посао библиотекара?</p>
    </>
  );
}

function GameSlide() {
  return <Game />;
}

function HowIMakeIt() {
  return (
    <>
      <h2>Како се праве апликације</h2>
      <ol className="steps">
        <li><strong>Смислити</strong>: шта апликација треба да ради?</li>
        <li><strong>Написати</strong> инструкције (код)</li>
        <li><strong>Испробати</strong>: да ли ради?</li>
        <li><strong>Поправити</strong> грешке. Оне се зову „багови“ (<em>bugs</em>) 🐛</li>
        <li><strong>Поделити</strong> је са људима!</li>
      </ol>
    </>
  );
}

const question = (text, hint, kicker = "Подигните руку ✋") =>
  function Question() {
    return (
      <>
        <p className="kicker">{kicker}</p>
        <h1 className={text.length > 60 ? "long" : undefined}>{text}</h1>
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
  BeforeComputers,
  BigLibrary,
  WhatIsApp,
  HowIMakeIt,
  question("Ко је користио рачунар?"),
  GameSlide,
  FindTheBug,
  ThankYou,
];

export default slides;
