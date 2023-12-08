import NewBill from '../containers/NewBill';
import { fireEvent, screen } from '@testing-library/dom';

describe('NewBill', () => {
  it('should handle file change', async () => {
    const wrongFormatFile = new File(["hello"], "hello.txt", { type: "document/txt" })
    const mockGetElementById = jest.fn()
    const mockErrorObj = {};
    mockGetElementById.mockReturnValue(mockErrorObj)
    const documentMock = {
      querySelector: (s) => {
        console.log('querySelector with ', s)
        if (s === 'input[data-testid="file"]') {
          return {
            files: [wrongFormatFile],
            addEventListener: () => true,
          }
        } else {
          return { addEventListener: () => true }
        }
      },
      getElementById: mockGetElementById
    }        
    const objInstance = new NewBill({
      document: documentMock,
      onNavigate: {},
      store: {},            
      localStorage: {}
    })
    objInstance.handleChangeFile({ preventDefault: () => true, target: {value: 'hello.txt'} })
  });
});
