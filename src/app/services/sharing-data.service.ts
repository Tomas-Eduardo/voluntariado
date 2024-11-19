import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SharingDataService {

  // Users
  
  private _newUserEnventEmitter: EventEmitter<User> = new EventEmitter<User>();

  private _idUserEventEmitter = new EventEmitter();

  private _findUserByIdEventEmitter = new EventEmitter();

  private _selectUserEventEmitter = new EventEmitter();

  private _errorsUserFormEventEmitter = new EventEmitter();

  // Contacts

  private _newContactEventEmitter = new EventEmitter();

  private _idContactEventEmitter = new EventEmitter();

  private _findContactByIdEventEmitter = new EventEmitter();

  private _selectContactEventEmitter = new EventEmitter();

  private _errorsContactFormEventEmitter = new EventEmitter();

  // Handle Login

  private _handlerLoginEventEmitter = new EventEmitter();

  // Orgs

  private _newOrgEventEmitter = new EventEmitter();

  private _idOrgEventEmitter = new EventEmitter();

  private _findOrgByIdEventEmitter = new EventEmitter();

  private _selectedOrgEventEmitter = new EventEmitter();

  private _errorsOrgEventEmmiter = new EventEmitter();

  constructor() {}

  // Users

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEnventEmitter;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }

  get findUserByIdEventEmitter() {
    return this._findUserByIdEventEmitter;
  }

  get selectUserEventEmitter() {
    return this._selectUserEventEmitter;
  }

  get errorsUserFormEventEmitter() {
    return this._errorsUserFormEventEmitter;
  }

  // Contacts

  get newContactEventEmitter() {
    return this._newContactEventEmitter;
  }

  get idContactEventEmitter() {
    return this._idContactEventEmitter;
  }

  get findContactByIdEventEmitter() {
    return this._findContactByIdEventEmitter;
  }

  get selectContactEventEmitter() {
    return this._selectContactEventEmitter;
  }

  get errorsContactFormEventEmitter() {
    return this._errorsContactFormEventEmitter;
  }

  // Handle Login

  get handlerLoginEventEmitter() {
    return this._handlerLoginEventEmitter;
  }

  // Orgs

  get newOrgEventEmitter() {
    return this._newOrgEventEmitter;
  }

  get idOrgEventEmitter() {
    return this._idOrgEventEmitter;
  }

  get findOrgByIdEventEmitter() {
    return this._findOrgByIdEventEmitter;
  }

  get selectedOrgEventEmitter() {
    return this._selectedOrgEventEmitter;
  }

  get errorsOrgEventEmitter() {
    return this._errorsOrgEventEmmiter;
  }

}
