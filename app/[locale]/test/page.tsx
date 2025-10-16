'use client'

import { useTranslation } from "react-i18next"


export default function testFun(){
    const {t} = useTranslation('common')
    return <h2>{t('hello')}</h2>
}