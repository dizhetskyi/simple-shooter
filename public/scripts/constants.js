import io from 'socket.io-client';

export const socket = io.connect('http://localhost:1337');

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

export const game_width = 400;
export const game_height = 480;