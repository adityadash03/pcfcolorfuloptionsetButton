import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ColorfulOptionSetButton
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  /**
   * Variable Declaration
   */
  private theContext: ComponentFramework.Context<IInputs>;
  private theNotifyChanged: () => void;
  private theContainer: HTMLDivElement;

  private _outputValue: number | null;
  private _defaultValue: number | undefined;

  private optionSetArray:
    | ComponentFramework.PropertyHelper.OptionMetadata[]
    | undefined;

  /**
   * HTML Elements
   */
  private eleMainContainer: HTMLDivElement;
  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    // Initialize Component variables
    this.theContainer = container;
    this.theContext = context;
    this.theNotifyChanged = notifyOutputChanged;
    context.mode.trackContainerResize(false);
    // Get all options
    this.optionSetArray =
      context.parameters.OptionSetAttribute.attributes?.Options;

    // Add code to update control view
    this._defaultValue =
      context.parameters.OptionSetAttribute.attributes?.DefaultValue;

    // Current selected value
    let currentInputData = context.parameters.OptionSetAttribute.raw || null;
    if (currentInputData != null) {
      this._outputValue = currentInputData;
    } else {
      if (this._defaultValue) {
        this._outputValue = this._defaultValue;
      }
    }

    // UI
    // Main Container
    this.eleMainContainer = document.createElement("div");
    this.eleMainContainer.id = "mybtn";
    this.eleMainContainer.className = "btn-group";

    // Create OptionSet Buttons
    if (this.optionSetArray) {
      let width = 100 / this.optionSetArray.length;
      for (var i = 0; i < this.optionSetArray.length; i++) {
        // Button
        let eleButton: HTMLButtonElement;
        eleButton = document.createElement("button");
        eleButton.innerHTML = this.optionSetArray[i].Label;
        eleButton.id = this.optionSetArray[i].Value.toString();
        eleButton.style.width = width.toString() + "%";
        eleButton.style.background = "#6f6f6f";
        eleButton.addEventListener("click", this.onButtonClick.bind(this));

        this.eleMainContainer.appendChild(eleButton);
      }
    }
    container.appendChild(this.eleMainContainer);
  }
  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    if (this.eleMainContainer.children.length > 0) {
      for (var i = 0; i < this.eleMainContainer.children.length; i++) {
        let elementButton = this.eleMainContainer.children[
          i
        ] as HTMLButtonElement;

        if (
          this._outputValue &&
          elementButton.id !== this._outputValue.toString()
        ) {
          elementButton.style.background = "#6f6f6f";
        } else if (
          this._outputValue &&
          elementButton.id === this._outputValue.toString()
        ) {
          if (this.optionSetArray) {
            var result = this.optionSetArray.filter((obj) => {
              return obj.Value === parseInt(elementButton.id);
            });
            elementButton.style.background = result[0].Color;
          }
        } else if (!this._outputValue) {
          elementButton.style.background = "#6f6f6f";
        }
        elementButton.disabled = context.mode.isControlDisabled;
      }
    }
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {
      OptionSetAttribute: this._outputValue == null ? -1 : this._outputValue,
    };
  }

  private onButtonClick(event: Event): void {
    // Selected button details
    let selectedElement = event.target as HTMLButtonElement;
    if (this._defaultValue && this._defaultValue > -1) {
      if (selectedElement) this._outputValue = parseInt(selectedElement.id);
    } else {
      if (selectedElement.id === this._outputValue?.toString()) {
        this._outputValue = null;
      } else {
        if (selectedElement) this._outputValue = parseInt(selectedElement.id);
      }
    }
    // if (selectedElement) this._outputValue = parseInt(selectedElement.id);
    this.theNotifyChanged();
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
