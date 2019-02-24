import { Component, h } from "preact";

// import Button from 'preact-material-components/ts/Button';
import MatDialog from "preact-material-components/ts/Dialog";

import TextField from "preact-material-components/TextField";

interface Props {
  onAccept: JSX.GenericEventHandler;
  inputTexts: {
    [inputText: string]: {
      label: string,
      onKeyUp: (value: string) => void,
    },
  };
  headerText: string;
  declineText: string;
  acceptText: string;
  setRef: (ref: MatDialog) => void;
}

interface State {

}

export class Dialog extends Component<Props, State> {
  public scrollingDlg?: MatDialog;

  constructor(props: Props) {
    super(props);

    this.state = {

    };
  }

  public render({ headerText, declineText, acceptText, setRef, inputTexts, onAccept }: Props, {}: State) {
    return (
      <div>
        {
          <MatDialog ref={setRef} onAccept={onAccept} >
            <MatDialog.Header>{headerText}</MatDialog.Header>

            <MatDialog.Body scrollable={true}>
              <div>
                {
                  Object.keys(inputTexts).map((key) => (
                    <div key={key}>
                      <TextField
                      style={{ width: "100%"}}
                      outerStyle={{ width: "100%"}}
                        label={inputTexts[key].label}
                        onKeyUp={(e: any) => {
                          inputTexts[key].onKeyUp(new String(e.target.value).trim());
                        }}
                      />
                      {" "}
                    </div>
                  ))
                }
              </div>
            </MatDialog.Body>

            <MatDialog.Footer>
              <MatDialog.FooterButton  cancel={true}>{declineText}</MatDialog.FooterButton>
              <MatDialog.FooterButton accept={true}>{acceptText}</MatDialog.FooterButton>
            </MatDialog.Footer>
          </MatDialog>
        }
    </div>);
  }
}
