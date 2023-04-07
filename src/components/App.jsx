import { useState, useEffect, useRef } from 'react';
import { Section } from './Section/Section';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

export const App = () => {
  const [contacts, setContact] = useState([]);
  const [filter, setFilter] = useState('');
  const isMounted = useRef(false);

  const checkName = newContact => {
    const isNameOneList = contacts.some(
      contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
    );
    return isNameOneList;
  };

  const checkNumber = newContact => {
    const isNumberOnList = contacts.some(
      contact => contact.number === newContact.number
    );
    return isNumberOnList;
  };

  const addNewContact = newContact => {
    const isNameOneList = checkName(newContact);
    const isNumberOnList = checkNumber(newContact);

    if (isNameOneList) {
      alert(`${newContact.name} is already in contacts`);
    } else if (isNumberOnList) {
      alert(`This number ${newContact.number} is already in contacts`);
    } else {
      setContact(prevState => [...prevState, newContact]);
    }
  };

  const addFilterValue = e => {
    setFilter(e.target.value);
  };

  const deleteContact = e => {
    const newContacts = contacts.filter(contact => contact.id !== e.target.id);
    setContact(newContacts);
  };

  useEffect(() => {
    const list = window.localStorage.getItem('phonebook-contact');
    if (!list) return;

    try {
      setContact(JSON.parse(list));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const phonebookContactStringified = JSON.stringify(contacts);
    if (isMounted.current) {
      window.localStorage.setItem(
        'phonebook-contact',
        phonebookContactStringified
      );
    } else {
      isMounted.current = true;
    }
  }, [contacts]);

  return (
    <>
      <Section title="Phonebook">
        <ContactForm handleSubmit={addNewContact} />
      </Section>
      <Section title="Contacts">
        <Filter addFilterValue={addFilterValue} />
        <ContactList
          contacts={contacts}
          filterValue={filter}
          deleteContact={deleteContact}
        />
      </Section>
    </>
  );
};
