import { IValidate, validate } from 'utils/validation';
import autobind from 'decorators/autobind';
import { projectState } from 'state/projectState';

import Component from 'components/Component';

export default class ProjectInput extends Component<
  HTMLDivElement,
  HTMLFormElement
> {
  descriptionInputElement: HTMLInputElement;
  titleInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector('#title')
    );
    this.descriptionInputElement = <HTMLInputElement>(
      this.element.querySelector('#description')
    );
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector('#people')
    );

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private getUserInput(): [string, string, number] | Error {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const title: IValidate = {
      value: enteredTitle,
      required: true,
    };

    const description: IValidate = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const people: IValidate = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (!validate(title) || !validate(description) || !validate(people)) {
      throw new Error('Invalid input');
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, descr, people] = userInput;

      projectState.addProject(title, descr, people);

      this.clearInputs();
    }
  }
}
