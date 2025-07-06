/**
 * UI Control Actions Module
 * Handles all real-time UI manipulation and control actions
 */

import toast from 'react-hot-toast';
import { AIAction, AIContext } from '../AIContextService';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  nextActions?: AIAction[];
}

export interface UIElement {
  id: string;
  type: 'button' | 'input' | 'select' | 'checkbox' | 'slider' | 'modal' | 'form' | 'table' | 'chart';
  selector: string;
  page: string;
  description: string;
  actions: string[];
  currentState?: any;
}

export class UIControlActions {
  private uiElements: Map<string, UIElement> = new Map();

  constructor() {
    this.initializeUIElements();
  }

  async executeAction(action: AIAction, context?: AIContext): Promise<ActionResult> {
    switch (action.type) {
      case 'ui_control':
        return this.controlUIElement(action.payload, context);
      case 'form_control':
        return this.controlForm(action.payload, context);
      case 'ui_action':
        return this.executeUIAction(action.payload, context);
      case 'toggle_theme':
        return this.toggleTheme(action.payload, context);
      case 'customize_interface':
        return this.customizeInterface(action.payload, context);
      case 'update_dashboard_layout':
        return this.updateDashboardLayout(action.payload, context);
      default:
        throw new Error(`Unsupported UI control action: ${action.type}`);
    }
  }

  private async controlUIElement(payload: { element: string; action: string; value?: any }, context?: AIContext): Promise<ActionResult> {
    const uiElement = this.uiElements.get(payload.element);
    if (!uiElement) {
      return {
        success: false,
        message: `UI element '${payload.element}' not found`
      };
    }

    if (!uiElement.actions.includes(payload.action)) {
      return {
        success: false,
        message: `Action '${payload.action}' not supported for element '${payload.element}'`
      };
    }

    const element = document.querySelector(uiElement.selector) as HTMLElement;
    if (!element) {
      return {
        success: false,
        message: `Element with selector '${uiElement.selector}' not found in DOM`
      };
    }

    try {
      const result = await this.executeElementAction(element, uiElement, payload.action, payload.value);
      toast.success(`${uiElement.description} ${payload.action} executed`);

      return {
        success: true,
        message: `Successfully executed '${payload.action}' on ${uiElement.description}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to execute '${payload.action}' on ${uiElement.description}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async executeElementAction(element: HTMLElement, uiElement: UIElement, action: string, value?: any): Promise<any> {
    switch (uiElement.type) {
      case 'input':
        return this.handleInputAction(element as HTMLInputElement, action, value);
      case 'select':
        return this.handleSelectAction(element as HTMLSelectElement, action, value);
      case 'checkbox':
        return this.handleCheckboxAction(element as HTMLInputElement, action, value);
      case 'button':
        return this.handleButtonAction(element, action, value);
      case 'form':
        return this.handleFormAction(element as HTMLFormElement, action, value);
      default:
        return this.handleGenericAction(element, action, value);
    }
  }

  private async handleInputAction(input: HTMLInputElement, action: string, value?: any): Promise<any> {
    switch (action) {
      case 'search':
      case 'set':
        input.value = value || '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return { value: input.value };
      case 'clear':
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { value: '' };
      case 'focus':
        input.focus();
        return { focused: true };
      default:
        throw new Error(`Unsupported input action: ${action}`);
    }
  }

  private async handleSelectAction(select: HTMLSelectElement, action: string, value?: any): Promise<any> {
    switch (action) {
      case 'select':
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return { value: select.value };
      case 'clear':
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return { value: select.value };
      default:
        throw new Error(`Unsupported select action: ${action}`);
    }
  }

  private async handleCheckboxAction(checkbox: HTMLInputElement, action: string, value?: any): Promise<any> {
    switch (action) {
      case 'check':
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        return { checked: true };
      case 'uncheck':
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        return { checked: false };
      case 'toggle':
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        return { checked: checkbox.checked };
      default:
        throw new Error(`Unsupported checkbox action: ${action}`);
    }
  }

  private async handleButtonAction(button: HTMLElement, action: string, value?: any): Promise<any> {
    switch (action) {
      case 'click':
        button.click();
        return { clicked: true };
      case 'enable':
        (button as HTMLButtonElement).disabled = false;
        return { enabled: true };
      case 'disable':
        (button as HTMLButtonElement).disabled = true;
        return { enabled: false };
      default:
        throw new Error(`Unsupported button action: ${action}`);
    }
  }

  private async handleFormAction(form: HTMLFormElement, action: string, data?: any): Promise<ActionResult> {
    try {
      switch (action) {
        case 'submit':
          form.submit();
          toast.success('Form submitted');
          return { success: true, message: 'Form submitted successfully' };

        case 'reset':
          form.reset();
          toast.success('Form reset');
          return { success: true, message: 'Form reset successfully' };

        case 'fill':
          if (data) {
            Object.keys(data).forEach(key => {
              const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
              if (input) {
                input.value = data[key];
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            });
            toast.success('Form filled');
            return { success: true, message: 'Form filled successfully', data };
          }
          break;

        case 'validate':
          const isValid = form.checkValidity();
          return {
            success: true,
            message: isValid ? 'Form is valid' : 'Form has validation errors',
            data: { valid: isValid }
          };

        default:
          throw new Error(`Unsupported form action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        message: `Form action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    return { success: false, message: 'Unknown form action' };
  }

  private async handleGenericAction(element: HTMLElement, action: string, value?: any): Promise<any> {
    switch (action) {
      case 'show':
        element.style.display = '';
        return { visible: true };
      case 'hide':
        element.style.display = 'none';
        return { visible: false };
      case 'highlight':
        element.style.outline = '2px solid #3b82f6';
        setTimeout(() => element.style.outline = '', 2000);
        return { highlighted: true };
      case 'scroll':
        element.scrollIntoView({ behavior: 'smooth' });
        return { scrolled: true };
      case 'click':
        element.click();
        return { clicked: true };
      case 'focus':
        (element as HTMLInputElement).focus();
        return { focused: true };
      default:
        throw new Error(`Unsupported generic action: ${action}`);
    }
  }

  private async controlForm(payload: { form: string; action: string; data?: any }, context?: AIContext): Promise<ActionResult> {
    const form = document.querySelector(payload.form) as HTMLFormElement;
    if (!form) {
      return {
        success: false,
        message: `Form with selector '${payload.form}' not found`
      };
    }

    return this.handleFormAction(form, payload.action, payload.data);
  }

  private async executeUIAction(payload: { selector: string; action: string; value?: any }, context?: AIContext): Promise<ActionResult> {
    const element = document.querySelector(payload.selector) as HTMLElement;
    if (!element) {
      return {
        success: false,
        message: `Element with selector '${payload.selector}' not found`
      };
    }

    try {
      const result = await this.handleGenericAction(element, payload.action, payload.value);
      toast.success(`UI action '${payload.action}' executed`);
      
      return {
        success: true,
        message: `Successfully executed '${payload.action}' on element`,
        data: { selector: payload.selector, action: payload.action, value: payload.value, result }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to execute UI action: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async toggleTheme(payload: { theme?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = payload.theme || (currentTheme === 'light' ? 'dark' : 'light');
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      toast.success(`Switched to ${newTheme} theme`);
      
      return {
        success: true,
        message: `Theme changed to ${newTheme}`,
        data: { previousTheme: currentTheme, newTheme }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to toggle theme: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async customizeInterface(payload: { customizations: any }, context?: AIContext): Promise<ActionResult> {
    try {
      const { customizations } = payload;
      
      // Apply customizations
      if (customizations.fontSize) {
        document.documentElement.style.fontSize = customizations.fontSize;
      }
      
      if (customizations.colorScheme) {
        document.documentElement.setAttribute('data-color-scheme', customizations.colorScheme);
      }
      
      if (customizations.layout) {
        document.documentElement.setAttribute('data-layout', customizations.layout);
      }
      
      toast.success('Interface customized');
      
      return {
        success: true,
        message: 'Interface customized successfully',
        data: customizations
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to customize interface: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async updateDashboardLayout(payload: { layout: any }, context?: AIContext): Promise<ActionResult> {
    try {
      const { layout } = payload;
      
      // Update dashboard layout
      if (layout.gridColumns) {
        const dashboard = document.querySelector('.dashboard-grid');
        if (dashboard) {
          (dashboard as HTMLElement).style.gridTemplateColumns = `repeat(${layout.gridColumns}, 1fr)`;
        }
      }
      
      toast.success('Dashboard layout updated');
      
      return {
        success: true,
        message: 'Dashboard layout updated successfully',
        data: layout
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update dashboard layout: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private initializeUIElements(): void {
    // Initialize UI elements map with common dashboard elements
    const elements: UIElement[] = [
      {
        id: 'search_input',
        type: 'input',
        selector: 'input[type="search"], .search-input',
        page: 'all',
        description: 'Search input field',
        actions: ['search', 'set', 'clear', 'focus']
      },
      {
        id: 'theme_toggle',
        type: 'button',
        selector: '.theme-toggle, [data-theme-toggle]',
        page: 'all',
        description: 'Theme toggle button',
        actions: ['click', 'toggle']
      },
      {
        id: 'navigation_menu',
        type: 'button',
        selector: '.nav-menu, .hamburger-menu',
        page: 'all',
        description: 'Navigation menu',
        actions: ['click', 'show', 'hide']
      }
    ];

    elements.forEach(element => {
      this.uiElements.set(element.id, element);
    });
  }

  // Get available UI elements for current page
  getAvailableElements(page?: string): UIElement[] {
    return Array.from(this.uiElements.values()).filter(
      element => element.page === 'all' || element.page === page
    );
  }

  // Add custom UI element
  addUIElement(element: UIElement): void {
    this.uiElements.set(element.id, element);
  }

  // Remove UI element
  removeUIElement(elementId: string): void {
    this.uiElements.delete(elementId);
  }
}

export default UIControlActions;
