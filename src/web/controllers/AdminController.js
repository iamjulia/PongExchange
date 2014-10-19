"use strict";

var Affiliation = require('models/Affiliation');

var AdminController = module.exports;

/*
<<<<<<< HEAD
    /admin
    /admin/affiliation - list, add, edit, delete affiliations
*/

AdminController.indexGET = function*()
{
	yield this.render('admin/index');
}

AdminController.affiliationsIndexGET = function*()
{
    var affiliations = yield Affiliation.getAll();


    // sort by name asc
    affiliations.sort(function (p1, p2) { return p1.name.localeCompare(p2.name); });
    
    yield this.render('affiliations/index', { affiliations: affiliations });
};

AdminController.affiliationsEditGET = function*()
{
  var affiliation = yield Affiliation.getById(this.affiliation.id);
  
  yield this.render('affiliations/edit', { affiliation: affiliation });

};

AdminController.affiliationsUpdatePUT = function*()
{
  var response = this.request.body.fields;

  var affiliation = yield Affiliation.getById(this.affiliation.id);
  
  affiliation.name = response.affiliation.name || affiliation.name;

  if (yield affiliation.save()){
    this.redirect(affiliation.affiliationUrl);
  } else {
    console.log('This cannot be saved.');
  }
  
};

AdminController.affiliationsDELETE = function*()
{
  var response = this.request.body.fields;

  var affiliation = yield Affiliation.getById(this.affiliation.id);
  
  if (yield affiliation.delete()){
    this.redirect(affiliation.affiliationUrl);
  } else {
    console.log('This cannot be deleted.');
  }
  
};
