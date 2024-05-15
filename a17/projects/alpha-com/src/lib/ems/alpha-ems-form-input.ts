export class AlphaEmsFormInput<TB> {
  mode: 'read' | 'new' | 'edit';
  keys: string[] | undefined;
  options: Map<string, string> | undefined;
  params: any;
  body: TB | undefined;

  private constructor(
    mode: 'read' | 'new' | 'edit',
    keys?: string[],
    params?: any,
    options?: Map<string, string>,
    body?: TB) {
    this.mode = mode;
    this.keys = keys;
    this.params = params;
    this.options = options;
    this.body = body;
  }

  /**
   * Factor an AlphaEmsFormInput for readonly mode.
   *
   * @param {string[]} keys - The primary keys uniquely identifying an entity. This value will be sent to the server.
   * @param {*} [params] - An object that passes parameters to the UI.
   * @param {Map<string, string>} [options] - An options dictionary that will be sent to the server.
   * @param [body] - The body of the form input. should have type TB
   * @return {AlphaEmsFormInput} - An instance of AlphaEmsFormInput.
   */
  static factorForRead<TB>(
    keys: string[],
    params?: any,
    options?: Map<string, string>,
    body?: TB): AlphaEmsFormInput<TB> {
    return new AlphaEmsFormInput(
      'read', keys, params, options, body);
  }

  /**
   * Factor an AlphaGenFormInput for creation.
   *
   * @param params {any} - An object that passes params to the UI.
   * @param options {Map<string, string>} - An options dictionary that will reach the server.
   *
   * @return {AlphaEmsFormInput} - An instance of AlphaEmsFormInput object for new form input.
   */
  static factorForNew<TB>(
    params?: any,
    options?: Map<string, string>): AlphaEmsFormInput<TB> {
    return new AlphaEmsFormInput('new', [], params, options);
  }

  /**
   * Factor an AlphaGenFormInput for edition.
   *
   * @param {string[]} keys - The primary keys uniquely identifying an entity. This value will reach the server.
   * @param {any} params - An object that passes parameters to the UI.
   * @param {Map<string, string>} options - An options dictionary that will reach the server.
   * @returns {AlphaEmsFormInput} - An instance of AlphaEmsFormInput initialized for editing.
   */
  static factorForEdit<TB>(
    keys: string[],
    params?: any,
    options?: Map<string, string>): AlphaEmsFormInput<TB> {
    return new AlphaEmsFormInput('edit', keys, params, options);
  }


}
