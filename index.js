// import dictionaryEn from 'dictionary-en'
// import nspell from 'nspell'

// dictionaryEn(function (error, en) {
//   if (error) throw error
//   const spell = nspell(en)
//   console.log(spell.correct('color'))
//   console.log(spell.correct('colour'))
// })
//
	var dictCode = 'de';
	var dictionary = require('dictionary' + '-' + dictCode);
	var nspell = require('nspell')

	dictionary(ondictionary)

	function ondictionary(err, dict) {
	  if (err) {
	    throw err
	  }

	  var spell = nspell(dict)

	  console.log(spell.correct('colour')) // => false
	  console.log(spell.suggest('welcume')) // => ['color']
	  console.log(spell.correct('color')) // => true
	  console.log(spell.correct('npm')) // => false
	  spell.add('npm')
	  console.log(spell.correct('npm')) // => true
	}