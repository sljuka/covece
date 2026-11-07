import { useState } from "react";

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

const times = (n) => (n % 10 === 1 && n % 100 !== 11 ? "пут" : "пута");

function TinyApp() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h2>Хајде да погледамо једну малу апликацију</h2>
      <div className="compare">
        <div className="box code">
          <p className="note">Моја упутства (код):</p>
          <pre>
{`button.onClick(() => {
  say("Здраво, другари!")
  counter = counter + 1
})`}
          </pre>
        </div>
        <div className="box app">
          <button className="press" onClick={() => setCount((c) => c + 1)}>
            Притисни ме
          </button>
          <p className="lead">{count === 0 ? "…" : "Здраво, другари! 👋"}</p>
          <p>Притиснуто {count} {times(count)}</p>
        </div>
      </div>
    </>
  );
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

function BugStory() {
  return (
    <>
      <h2>Зашто се грешка зове „баг“?</h2>
      <p className="lead">
        Године 1947. један рачунар је престао да ради. Унутра су пронашли правог мољца 🦋
      </p>
      <p>Тим Грејс Хопер га је залепио у свеску као „први прави баг“.</p>
      <p className="note">
        На енглеском „баг“ значи буба. Данас се поправљање грешака у коду зове <strong>дебаговање</strong>.
      </p>
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

function ThankYou() {
  return (
    <>
      <h1>Хвала вам! 🙂</h1>
      <p className="lead">Имате ли питања за мене?</p>
    </>
  );
}

export default [
  Title,
  WhatIsSoftware,
  TwoKinds,
  IBuildApps,
  TinyApp,
  HowIMakeIt,
  BugStory,
  QuestionsIntro,
  question("Ко је користио рачунар?"),
  question("Ко користи телефон или таблет?"),
  question("Ко је играо игрицу на екрану?", "Ту игрицу је направио неко као ја!"),
  question("Која је ваша омиљена апликација?", "Шта вам се свиђа у њој?", "Реците ми 💬"),
  question("Ко мисли да су рачунари паметни?", "Трик питање: раде само оно што им кажемо!"),
  question("Да можете да направите било коју апликацију, шта би она радила?", null, "Реците ми 💬"),
  ThankYou,
];
