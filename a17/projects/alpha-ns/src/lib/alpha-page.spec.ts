// Importing required libraries and modules
import { AlphaPage } from './alpha-page';
import { describe, expect, it } from '@jest/globals';
import {IAlphaLoggerService, IAlphaPage} from "@pvway/alpha-common";

describe('AlphaPage', () => {
  let alphaPage: AlphaPage;

  beforeEach(() => {
    const iAlphaPage: IAlphaPage = {
      parentRoute: "Parent Route",
      route: "Route",
      area: "Area",
      logRoute: "Log Route",
      logTitle: "Log Title",
    };
    alphaPage = new AlphaPage(iAlphaPage);
  });

  it('should create an instance', () => {
    // Assert
    expect(alphaPage).toBeTruthy();
  });

  it('should correctly assign properties in constructor', () => {
    // Assert
    expect(alphaPage.parentRoute).toBe('Parent Route');
    expect(alphaPage.route).toBe('Route');
    expect(alphaPage.area).toBe('Area');
    expect(alphaPage.logRoute).toBe('Log Route');
    expect(alphaPage.logTitle).toBe('Log Title');
  });

  // More tests to be written here for other methods and properties as you define them
});
