'use client';
import Counter from '../features/counter/counter'
import Tabs from '../shared/tabs/Tabs'
import Tab from '../shared/tabs/Tab'
import { useState } from 'react';
import { Button } from '../ui/button';
import Modal from '../shared/modal/Modal';
import Dropdown from '../shared/dropdown/Dropdown';

const Day2 = () => {

    const [modalType, setModalType] = useState<string | null>(null);

    return (
        <>
            <Counter initialValue={5} min={0} max={10} step={2} />

            <Tabs defaultIndex={0}>
                <Tab label="Tab 1">Content 1</Tab>
                <Tab label="Tab 2">Content 2</Tab>
                <Tab label="Disabled Tab" disabled>
                    Should not open
                </Tab>
            </Tabs>

            <div className="flex gap-2 mt-4">
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


            <Dropdown
                label="Select framework"
                options={['React', 'Angular', 'Vue']}
                onSelect={(val) => console.log(val)}
            />
        </>
    )
}

export default Day2;