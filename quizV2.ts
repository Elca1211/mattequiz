//tsc --strict quizV2.ts; node quizV2.js 

import {
    for_each, filter, List, list, length, head,
    append
} from '../lib/list';

import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../lib/queue_array';

import * as promptSync from 'prompt-sync'; //npm install prompt-sync or npm i prompt-sync

//numbers to combine for random matching
const numbers = {
    num1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    num2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

/*
function timer(sec: number): number | string {
    console.log(sec);
    const counter: number = setInterval(() => {
        if (sec !== 0) {
            sec -= 1;
            console.log(sec);
        } else {
            clearInterval(counter);
            console.log('Time\'s up!');
        }

    }, 1000);
    
    return counter;
      
}

const countdown = (timer(5));
*/

const input = promptSync(); //takes user input
const username: string = input('Hello! What\'s your name?  ');
const choose_mtable: string = input('Welcome to our multiplication quiz ' + username + '! You can choose from 0-10. Which number do you want to start with?  ');
let user_input = parseInt(choose_mtable);

console.log('Let\'s revise multiplication with ' + choose_mtable + '!')

const mtable = (): void => {
    for(let x: number = 0; x <= 10; x += 1) { //returns and displays the multiplication table of the user's choice 
        let product = x * user_input;
        console.log(x + ' * ' + user_input + ' = ' + product);

}};

console.log('Ready to start? Let\'s go!');

let points: number = 0;
let points_history: Queue<number | null> = empty();



for(let x: number = 0; x <= 10; x += 1) { //returns and displays the multiplication table of the user's choice 
    let product = x * user_input;
    const user_answer: string = input(x + ' * ' + user_input + ' =  ');
     
        if (parseInt(user_answer) === product) {
            points += 1;
            console.log('Good job! Your total: ' + points);
            enqueue(1, points_history);

        } else {
            console.log('Not exactly. Your total remains: ' + points);
            enqueue(0, points_history);

        }

}
        
    console.log('Congratulations, you have earned ' + points + ' points!');
    dequeue(points_history);
    console.log('See your points/exercise: ' + points_history); //points_history is only partially correct              

