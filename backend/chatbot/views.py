from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from chatbot.rag_chain import rag_chain


class ChatbotView(APIView):
    def get(self, request):
        data = request.body
        user_query = data.get("query")
        print(user_query)

        response = rag_chain.run(user_query)
        return Response({"response": response})
