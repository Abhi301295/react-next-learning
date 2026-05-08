'use client';

import { useState } from 'react';
import Counter from '../../components/features/counter/Counter';
import Dropdown from '../../components/shared/dropdown/Dropdown';
import DropdownOption from '../../components/shared/dropdown/DropdownOption';
import Modal from '../../components/shared/modal/Modal';
import Tab from '../../components/shared/tabs/Tab';
import Tabs from '../../components/shared/tabs/Tabs';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Day2Client = () => {
  const [modalType, setModalType] = useState<string | null>(null);
  const [framework, setFramework] = useState<string | undefined>();
  const [frameworks, setFrameworks] = useState<string[]>([]);

  return (
    <section className="space-y-8">
      <section>
        <h2 className="mb-2 text-lg font-semibold">Counter with limit (min 0 && max 10 && step 2)</h2>
        <Counter initialValue={5} min={0} max={10} step={2} />
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Counter with no limit</h2>
        <Counter />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Tabs</h2>

        <Tabs defaultIndex={0}>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
          <Tab label="Disabled Tab" disabled>
            Should not open
          </Tab>
        </Tabs>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Modal Variants</h2>

        <div className="flex gap-2">
          <Button onClick={() => setModalType('default')}>Default</Button>

          <Button onClick={() => setModalType('noClose')}>Disable Close</Button>

          <Button onClick={() => setModalType('custom')}>Custom</Button>
        </div>

        <Modal
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          disableClose={modalType === 'noClose'}
          title={`Modal: ${modalType}`}
          panelClass={modalType === 'custom' ? 'max-w-2xl bg-surface' : ''}
        >
          {modalType === 'default' && <p>Default modal</p>}
          {modalType === 'noClose' && <p>Cannot close by outside click or ESC</p>}
          {modalType === 'custom' && <p>Custom styled modal</p>}
        </Modal>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Dropdown</h2>

        <div className="space-y-4">
          <Dropdown
            value={framework}
            onChange={(val) => setFramework(val as string)}
            placeholder="Select framework"
          >
            <DropdownOption value="react">React</DropdownOption>
            <DropdownOption value="angular">Angular</DropdownOption>
            <DropdownOption value="vue">Vue</DropdownOption>
          </Dropdown>

          <Dropdown
            multiple
            value={frameworks}
            onChange={(val) => setFrameworks(val as string[])}
            placeholder="Select frameworks"
          >
            <DropdownOption value="react">React</DropdownOption>
            <DropdownOption value="angular">Angular</DropdownOption>
            <DropdownOption value="vue">Vue</DropdownOption>
          </Dropdown>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Inputs</h2>

        <div className="space-y-3">
          <Input placeholder="Enter name" />

          <Input label="Password" type="password" error="Password is required" />

          <Input type="email" placeholder="Enter email" />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Badges</h2>

        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </section>
    </section>
  );
};

export default Day2Client;
