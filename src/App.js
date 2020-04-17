import React from 'react';
import './App.css';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import {shuffle} from 'lodash';
import ReactCardFlip from 'react-card-flip';
import Card from './Card';

const DIFFICULTY_EASY = 'DIFFICULTY_EASY';
const DIFFICULTY_MEDIUM = 'DIFFICULTY_MEDIUM';
const DIFFICULTY_HARD = 'DIFFICULTY_HARD';

const diffMap = {
  [DIFFICULTY_EASY]: {
    rows: 4,
    columns: 4,
  },
  [DIFFICULTY_MEDIUM]: {
    rows: 6,
    columns: 6,
  },
  [DIFFICULTY_HARD]: {
    rows: 10,
    columns: 10,
  },
};



class App extends React.Component {
  constructor() {
    super();

    this.state = {
      difficulty: DIFFICULTY_EASY,
      cards: [],
      openedCards: [],
      matchedCards: [],
      clickCount: 0,
      win: false,
    };
  }

  componentDidMount() {
    this.initGame();
  }

  initGame() {
    const rows = diffMap[this.state.difficulty].rows;
    const columns = diffMap[this.state.difficulty].columns;

    let fullItems = [];

    for (let i = 0; i < rows * columns / 2; i++) {
      for (let j = 0; j < 2; j++) {
        fullItems.push(i);
      }
    }

    const shuffled = shuffle(fullItems);
    const cards = [];

    shuffled.forEach((item) => {
      cards.push({
        value: item,
        opened: false,
      });
    });

    this.setState({
      cards,
    });
  }

  openCard(index) {
    if (this.state.matchedCards.includes(index)) {
      return;
    }

    let cards = this.state.cards.slice();
    let matchedCards = this.state.matchedCards.slice();

    let openedCards = this.state.openedCards;
    if (openedCards.length >= 2) {
      openedCards.forEach((openedCardIndex) => {
        if (!matchedCards.includes(openedCardIndex)) {
          cards[openedCardIndex].opened = false;
        }
      });
      openedCards = [];
    }

    cards[index].opened = !cards[index].opened;

    openedCards.push(index);

    this.setState({
      cards,
      openedCards,
      clickCount: this.state.clickCount + 1,
    }, () => {
      let matchedCards = this.state.matchedCards.slice();

      if (
        this.state.openedCards.length === 2
        && this.state.cards[this.state.openedCards[0]].value === this.state.cards[this.state.openedCards[1]].value
      ) {
        matchedCards.push(this.state.openedCards[0]);
        matchedCards.push(this.state.openedCards[1]);

        let win = false;
        if (matchedCards.length === this.state.cards.length) {
          win = true;
        }

        this.setState({
          matchedCards,
          win,
        });
      }
    });
  }

  _isOpened(item) {
    return item.opened || this.state.matchedCards.includes(item);
  }

  _renderTitle() {
    return (
      <React.Fragment>
        <h1>Memories game</h1>
        <h3>Clicked times: {this.state.clickCount}</h3>
      </React.Fragment>
    );
  }

  render() {
    if (this.state.win) {
      return <h1>Congrats!!!</h1>
    }

    return (
      <div className="App">
        {this._renderTitle()}
        <div className={'row'}>
          {
            this.state.cards.map((item, index) =>
              <ReactCardFlip key={index} isFlipped={this._isOpened(item)} flipDirection="horizontal">
                <Card key={index} onClick={this.openCard.bind(this, index)} index={index}>
                  closed!
                </Card>
                <Card key={index} onClick={this.openCard.bind(this, index)} index={index}>
                  {item.value}
                </Card>
              </ReactCardFlip>
            )
          }
        </div>
      </div>
    );
  }
}

export default App;
