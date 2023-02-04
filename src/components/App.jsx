import { Component } from 'react';
import { nanoid } from 'nanoid';

import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('my-contacts'));
    if (contacts) {
      this.setState({ contacts });
    }
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts !== contacts) {
      localStorage.setItem('my-contacts', JSON.stringify(contacts));
    }
  }

  formSubmitHandler = ({ name, number }) => {
    if (this.isDublicate(name)) {
      alert(`${name} is already in contacts.`);
      return false;
    }

    this.setState(prevState => {
      const { contacts } = prevState;
      const newContact = {
        id: nanoid(),
        name,
        number,
      };
      return { contacts: [newContact, ...contacts] };
    });
    return true;
  };

  isDublicate(contactName) {
    const normalizingName = contactName.toLowerCase();
    const { contacts } = this.state;
    const result = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizingName;
    });
    return Boolean(result);
  }

  getContacts() {
    const { contacts, filter } = this.state;
    const normalizingFilter = filter.toLowerCase().trim();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizingFilter)
    );
  }

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { filter } = this.state;

    return (
      <>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.formSubmitHandler} />
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter} />
        <ContactList
          contacts={this.getContacts()}
          deleteContact={this.deleteContact}
        />
      </>
    );
  }
}

export default App;
