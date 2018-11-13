import { MatSelect } from '@angular/material';
import { Component, OnInit, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NexusService } from '../../services/nexus.service';
declare var JSONEditor;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggingIn: boolean = false;
  hide: boolean = true;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private nexus: NexusService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });

    JSONEditor.defaults.themes.html = JSONEditor.AbstractTheme.extend({
      getFormInputLabel: function (text) {
        var el = this._super(text);
        el.style.display = 'block';
        el.style.marginBottom = "3px";
        el.style["font-size"] = '13px';
        el.style.color = 'purple';
        return el;
      },
      getSelectInput: function (options) {
        var selectForm = document.createElement('mat-form-field')
        selectForm.classList.add('mat-form-field', 'mat-primary', 'mat-form-field-type-mat-native-select', 'mat-form-field-appearance-legacy', 'mat-form-field-can-float', 'mat-form-field-hide-placeholder')

        var select = document.createElement('select');
        select.classList.add('mat-input-element', 'mat-form-field-autofill-control')
        if (options) this.setSelectOptions(select, options);

        var matFormFieldInfix = document.createElement('div');
        matFormFieldInfix.classList.add('mat-form-field-infix');
        matFormFieldInfix.appendChild(select);
        matFormFieldInfix.style.border = '0px';
        matFormFieldInfix.style.paddingTop = '0px';

        var matFormFieldFlex = document.createElement('div');
        matFormFieldFlex.classList.add('mat-form-field-flex');
        matFormFieldFlex.appendChild(matFormFieldInfix);

        var underline = document.createElement('div');
        underline.classList.add("mat-form-field-underline")

        var matFormFieldWrapper = document.createElement('div');
        matFormFieldWrapper.classList.add('mat-form-field-wrapper');
        matFormFieldWrapper.appendChild(matFormFieldFlex);
        matFormFieldWrapper.appendChild(underline);

        selectForm.appendChild(matFormFieldWrapper);
        return selectForm;
      },
      setSelectOptions: (select, options, titles) => {
        if (select.childNodes.length > 0) {
          select = select.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        }
        titles = titles || [];
        select.innerHTML = '';
        for (var i = 0; i < options.length; i++) {
          var option = document.createElement('option');
          option.setAttribute('value', options[i]);
          option.textContent = titles[i] || options[i];
          select.appendChild(option);
        }
      },
      getFormInputField: (type) => {
        if (type == "text") {
          var input = document.createElement('input');
          input.setAttribute('type', type);
          input.classList.add('mat-input-element', 'mat-form-field-autofill-control')

          var matFormFieldInfix = document.createElement('div');
          matFormFieldInfix.classList.add('mat-form-field-infix');
          matFormFieldInfix.appendChild(input);
          matFormFieldInfix.style.border = '0px';
          matFormFieldInfix.style.paddingTop = '0px';

          var matFormFieldFlex = document.createElement('div');
          matFormFieldFlex.classList.add('mat-form-field-flex');
          matFormFieldFlex.appendChild(matFormFieldInfix);

          var underline = document.createElement('div');
          underline.classList.add("mat-form-field-underline")

          var matFormFieldWrapper = document.createElement('div');
          matFormFieldWrapper.classList.add('mat-form-field-wrapper');
          matFormFieldWrapper.appendChild(matFormFieldFlex);
          matFormFieldWrapper.appendChild(underline);

          var formField = document.createElement('mat-form-field');
          formField.classList.add('mat-form-field', 'mat-primary', 'mat-form-field-type-mat-native-select', 'mat-form-field-appearance-legacy', 'mat-form-field-can-float', 'mat-form-field-hide-placeholder');
          formField.appendChild(matFormFieldWrapper);
          return formField
        } else {
          var el = document.createElement('input');
          el.setAttribute('type', type);
          return el;
        }
      },
      getButton(text, icon, title) {
        console.log(text, icon, title)
        var el = document.createElement('button');
        el.type = 'button';
        el.classList.add('mat-button');
        // if (text == 'Collapse' || text == 'Expand' || text == "Edit JSON" || text == "Object Properties"){
        el.style.minWidth = '10px';
        el.style.paddingLeft = '7px';
        el.style.paddingRight = '7px';
        this.setButtonText(el, text, icon, title);
        return el;
      },
      setButtonText: function (button, text, icon, title) {
        if (text == 'Collapse') {
          icon = document.createElement('mat-icon');
          icon.classList.add('mat-icon', 'material-icons');
          icon.innerHTML = 'keyboard_arrow_up';
          icon.style.verticalAlign = 'middle';
          text = '';
        } else if (text == 'Expand') {
          icon = document.createElement('mat-icon');
          icon.classList.add('mat-icon', 'material-icons');
          icon.innerHTML = 'keyboard_arrow_down';
          icon.style.verticalAlign = 'middle';
          text = '';
        } else if (text == 'Edit JSON') {
          icon = document.createElement('mat-icon');
          icon.classList.add('mat-icon', 'material-icons');
          icon.innerHTML = 'edit';
          icon.style.verticalAlign = 'middle';
          text = 'JSON';
          console.log("text", text, icon, title)
        } else if (text == 'Object Properties') {
          icon = document.createElement('mat-icon');
          icon.classList.add('mat-icon', 'material-icons');
          icon.innerHTML = 'edit';
          icon.style.verticalAlign = 'middle';
          text = 'Properties';
        }
        button.innerHTML = '';
        if (icon) {
          button.appendChild(icon);
          button.innerHTML += ' ';
        }
        button.appendChild(document.createTextNode(text));
        if (title) button.setAttribute('title', title);
      },
      getButtonHolder: function () {
        var el = document.createElement('span');
        return el;
      }
    });
    var editor = new JSONEditor(document.getElementById('editor_holder'), {
      iconlib: "material",
      schema: {
        type: "object",
        title: "Car",
        properties: {
          make: {
            type: "string",
            enum: [
              "Toyota",
              "BMW",
              "Honda",
              "Ford",
              "Chevy",
              "VW"
            ]
          },
          model: {
            type: "string"
          },
          year: {
            type: "integer",
            enum: [
              1995, 1996, 1997, 1998, 1999,
              2000, 2001, 2002, 2003, 2004,
              2005, 2006, 2007, 2008, 2009,
              2010, 2011, 2012, 2013, 2014
            ],
            default: 2008
          },
          safety: {
            type: "integer",
            format: "rating",
            maximum: "5",
            exclusiveMaximum: false,
            readonly: false
          }
        }
      }
    });
  }

  // TODO handle errors
  login() {
    this.loggingIn = true;
    let v = this.form.value;
    this.nexus.login(v.user, v.password);
  }

}
