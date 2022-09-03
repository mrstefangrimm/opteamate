import { AppPage } from './app.po'
import { browser, by, element, logging } from 'protractor'

describe('workspace-project App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('should have title', () => {
    page.navigateTo()
    expect(page.getTitleText()).toEqual('AngularMate')
  })

  it('should have reset button', () => {
    element(by.id('btnCreate')).getAttribute('type').then(x => expect(x).toEqual('reset'))
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER)
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry))
  })
})
