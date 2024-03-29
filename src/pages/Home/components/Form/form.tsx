import { Div, Card, Upper, P, Error } from "./form.styled";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { useEffect, useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";

const CRYPTO_QUERY = gql`
    query price($name: String) {
        markets(filter:{ baseSymbol: {_eq:$name} quoteSymbol: {_eq:"EUR"}}) {
            marketSymbol
            ticker {
                lastPrice
            }
        }
    }
`;

const List = (props: any) => {
    const [name, setName] = useState("");
    const [cryptoName, setCryptoName] = useState("");
    const [fetchData, { loading, data }] = useLazyQuery(CRYPTO_QUERY, {
        variables: { name }
    });

    useEffect(() => {
        if(data) {
            const localStorageData = localStorage.getItem("data");
            let obj: any = {};
    
            if (data?.markets?.length > 0 && data?.markets[0]?.ticker?.lastPrice) {
                obj.id = Date.now();
                obj.name = name;
                obj.price = parseFloat(data?.markets[0]?.ticker?.lastPrice).toFixed(2) ?? "-";
                
                if (localStorageData) {
                    const crypto = JSON.parse(localStorageData);
                    crypto.push(obj);
                    props.setData(crypto);
                    localStorage.setItem("data", JSON.stringify(crypto));
                } else {
                    const crypto = [obj];
                    props.setData(crypto);
                    localStorage.setItem("data", JSON.stringify(crypto));
                }
            } else {
                setCryptoName(name)
            }
            setName("");
        }
    }, [data])
    
    const addCrypto = () => {
        fetchData({ variables: { name } })
        setCryptoName("")
    };
    return (
        <Div>
            <Card>
                <Upper>
                    <Input
                        placeholder="Cryptocurrency Code"
                        onChange={(e: any) => setName(e.target.value)}
                        value={name}
                    />
                    <Error>{cryptoName ? `${cryptoName} is not available.` : ''}</Error>
                    <Button onClick={addCrypto} disabled={!name} label={"Add"} />
                    <P>Use of this service is subject to terms and conditions.</P>
                </Upper>
            </Card>
        </Div>
    );
};

export default List;
