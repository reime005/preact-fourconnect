import { h, Component } from 'preact';

import Select from 'preact-material-components/ts/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';

interface Props {
  chosenIndex: number,
  options: any[],
  hintText: string,
  onChange: (e: Event & {target: EventTarget & {selectedIndex: number}}) => void
}

interface State {
  
}

export class Selector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {

    }
  }

  render({ options, chosenIndex, hintText, onChange }: Props, {}: State) {
    return (
      <div>
        {
          options.length > 0 ? (
          <Select 
            style={{
              width: 200,
            }}
            hintText={hintText}
            selectedIndex={chosenIndex}
            onChange={onChange}>
              {
                options.map(option => <Select.Item>{String(option)}</Select.Item>)
              }
          </Select>)
          : null
        }
    </div>);
  }
}
