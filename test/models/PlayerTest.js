"use strict";

var assert = require('assert');
var Game = require('../../src/node_modules/models/Game');
var Player = require('../../src/node_modules/models/Player');
var TestUtils = require('TestUtils.js');

suite('Player tests', function ()
{
	test('inserting a player', function* ()
	{
		var p = new Player();
		p.name = 'Jarrod';
		yield p.save();
		assert(p.id >= 0, 'player was not inserted');
		
		// can also insert a player by just email
		p = new Player();
		p.email = 'JARROD@gmail.com';
		yield p.save();
		assert(p.id >= 0, 'player was not inserted');
		
		p = yield Player.getById(p.id);
		assert(p.email === 'jarrod@gmail.com', 'email should have been normalized');
		assert(p.name === 'jarrod@gmail.com', 'name should be email');
	});
	
	test('updating a player', function*()
	{
		var p = yield TestUtils.getPlayer();
		p.name = 'Billy Breathes';
		yield p.save();
		
		p = yield Player.getById(p.id);
		assert.equal(p.name, 'Billy Breathes');
	});
	
	test('getting a player by id', function* () 
	{
		var p = new Player();
		p.name = 'Billy Mays';
		p.rating = 100;
		yield p.save();
		assert(p.id, 'should have saved');
		
		var p2 = yield Player.getById(0);
		assert(p2 == null, 'there should be no player with id == 0');

		p2 = yield Player.getById(p.id);
		assert.deepEqual(p2, p, 'players should be equal');
	});

	test('getting a player by email', function* ()
	{
		// we normalized emails to lower case
		var p = new Player();
		p.email = 'TEST@TEST.COM';
		yield p.save();
		
		var p2 = yield Player.getByEmail('test@test.com'); 
		assert.deepEqual(p2, p, 'should have fetched a player');
	});
	
	test('getting players with their stats', function*()
	{
		var p1 = yield TestUtils.getPlayer(),
			p2 = yield TestUtils.getPlayer();
		
		// singles stats first
		yield TestUtils.getGame({ team1: [p1], team2: [p2] });
		
		// p1 should have played one game with one win
		yield p1.loadStats();
		assert(p1.stats != null, 'should have loaded some stats');
		assert(p1.stats.singlesGamesPlayed === 1, 'should have played a singles game');
		assert(p1.stats.singlesGamesWon === 1, 'should have won the first singles game');
	});

	test('creating/updating player roles', function*()
	{
		// by default, players have a "pending approval" role - let's override that here
		var p = yield TestUtils.getPlayer({player_type_id: Player.types.active});
		var pDb = yield Player.getById(p.id);
		
		// by fetching the player again from the database, we assert that the insertion happened correctly
		assert.equal(p.player_type_id, pDb.player_type_id);
		
		// now ensure that player.save correctly updates the database
		p.player_type_id = Player.types.admin;
		yield p.save();

		pDb = yield Player.getById(p.id);
		assert.equal(p.player_type_id, pDb.player_type_id);
	});
	
});