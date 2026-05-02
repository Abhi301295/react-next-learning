'use client';

import Counter from '../../components/features/counter/Counter'
import Tabs from '../../components/shared/tabs/Tabs'
import Tab from '../../components/shared/tabs/Tab'
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import Modal from '../../components/shared/modal/Modal';
import Dropdown from '../../components/shared/dropdown/Dropdown';
import DropdownOption from '../../components/shared/dropdown/DropdownOption';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const Day2Client = () => {

    const [modalType, setModalType] = useState<string | null>(null);
    const [framework, setFramework] = useState<string | undefined>();
    const [frameworks, setFrameworks] = useState<string[]>([]);

    return (
        <section className="space-y-8">
            <section>
                <h2 className="text-lg font-semibold mb-2">Counter with limit (min 0 && max 10 && step 2)</h2>
                <Counter initialValue={5} min={0} max={10} step={2} />
            </section>
            <section>
                <h2 className="text-lg font-semibold mb-2">Counter with no limit</h2>
                <Counter />
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-2">Tabs</h2>

                <Tabs defaultIndex={0}>
                    <Tab label="Tab 1">Content 1</Tab>
                    <Tab label="Tab 2">Content 2</Tab>
                    <Tab label="Disabled Tab" disabled>
                        Should not open
                    </Tab>
                </Tabs>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-2">Modal Variants</h2>

                <div className="flex gap-2">
                    <Button onClick={() => setModalType('default')}>
                        Default
                    </Button>

                    <Button onClick={() => setModalType('noClose')}>
                        Disable Close
                    </Button>

                    <Button onClick={() => setModalType('custom')}>
                        Custom
                    </Button>
                </div>

                <Modal
                    isOpen={modalType !== null}
                    onClose={() => setModalType(null)}
                    disableClose={modalType === 'noClose'}
                    title={`Modal: ${modalType}`}
                    panelClass={modalType === 'custom' ? 'max-w-2xl bg-gray-100' : ''}
                >
                    {modalType === 'default' && <p>Default modal</p>}
                    {modalType === 'noClose' && <p>Cannot close by outside click or ESC</p>}
                    {modalType === 'custom' && <p>Custom styled modal</p>}
                </Modal>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-2">Dropdown</h2>

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
                <h2 className="text-lg font-semibold mb-2">Inputs</h2>

                <div className="space-y-3">
                    <Input placeholder="Enter name" />

                    <Input
                        label="Password"
                        type="password"
                        error="Password is required"
                    />

                    <Input type="email" placeholder="Enter email" />
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-2">Badges</h2>

                <div className="flex gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                </div>
            </section>

        </section>
    )
}

export default Day2Client;